import sqlite3 as sql
from typing import List, Dict, Tuple
import osmium as osm
import math
import argparse
import os
import struct
import numpy as np
import sys
import json

class Edge():
    __slots__ = "index", "nodeA", "nodeB", "coords", "oneway", "weight"
    def __init__(self, coords:list, oneway:bool, templimit:str):
        self.index = 0
        self.nodeA = 0
        self.nodeB = 0
        self.coords = coords
        self.oneway = oneway
        self.weight = templimit

class Node():
    __slots__ = "coord", "index", "edges"
    def __init__(self, coord):
        self.coord = coord
        self.index = 0
        self.edges = []

class Coord():
    __slots__ = "lon", "lat"
    def __init__(self, lon, lat):
        self.lon = lon
        self.lat = lat

class WayHandler(osm.SimpleHandler):
    def __init__(self, edgeslist:List[Edge], nodesdict:Dict[int,Node], coords:Dict[int, Coord]):
        super(WayHandler, self).__init__()
        self.i = 0
        self.edges = edgeslist
        self.nodesdict = nodesdict
        self.coords = coords
        self.types = ["motorway","motorway_link","trunk","trunk_link",
        "primary","primary_link","secondary","secondary_link","tertiary","tertiary_link",
        "residential","living_street","service","track", "unclassified", "road"]
    def way(self, w):
        if "highway" not in w.tags:
            return
        if w.tags.get("highway") not in self.types:
            return
        self.i += 1
        if self.i % 1000 == 0:
            print(str(self.i))
        nodes = []
        l = len(w.nodes)
        for i in range(0,l):
            ndref = w.nodes[i].ref
            nodes.append(ndref)
            self.coords[ndref] = 0
            if (i == 0 or i == l-1):
                self.nodesdict[ndref] = 1
        self.edges.append(Edge(nodes, is_oneway(w), get_templimit(w.tags.get("maxspeed", None), w.tags.get("highway"))))

class NodeHandler(osm.SimpleHandler):
    def __init__(self, nodesdict:Dict[int,Node], coords:Dict[int, Coord]):
        super(NodeHandler, self).__init__()
        self.i = 0
        self.nodesdict = nodesdict
        self.coords = coords
    def node(self, n):
        count = self.coords.get(n.id)
        if count != 0:
            return
        self.coords[n.id] = Coord(n.location.lon, n.location.lat)
        if self.nodesdict.get(n.id) == 1:
            node = Node(n.id)
            self.nodesdict[n.id] = node
            self.i += 1
            if self.i % 10000 == 0:
                print(str(self.i))

def parse_osm(file:str):
    edgeslist:List[Edge] = []
    nodesdict:Dict[int, Node] = dict()
    coordsdict:Dict[int, Coord] = {}
    h = WayHandler(edgeslist, nodesdict, coordsdict)
    h.apply_file(file)
    h = NodeHandler(nodesdict, coordsdict)
    h.apply_file(file)
    edgeslist = split_edges(edgeslist, nodesdict)
    i = 0
    for node in nodesdict.values():
        node.index = i
        i+=1
    i = 0
    for edge in edgeslist:
        edge.index = i
        nodeA = nodesdict[edge.coords[0]]
        nodeB = nodesdict[edge.coords[len(edge.coords)-1]]
        edge.nodeA = nodeA.index
        edge.nodeB = nodeB.index
        nodeA.edges.append(edge.index)
        nodeB.edges.append(edge.index)
        edge.weight = haversine_length(edge.coords, coordsdict) * 130 / edge.weight
        i+=1
    return edgeslist, nodesdict, coordsdict

def split_edges(edgelist:List[Edge], nodedict:Dict[int, Node]) -> List[Edge]:
    newlist = []
    for j in range(0, len(edgelist)):
        edge = edgelist[j]
        start = 0
        for i in range(1, len(edge.coords)):
            if isinstance(nodedict.get(edge.coords[i]), Node):
                newedge = Edge(edge.coords[start:i+1], edge.oneway, edge.weight)
                newlist.append(newedge)
                start = i
    return newlist

def is_oneway(edge):
    if edge.tags.get('oneway') == "yes":
        return True
    if edge.tags.get('oneway') == "no":
        return False
    if edge.tags.get('highway') in ["motorway","trunk"]:
        return True
    if edge.tags.get('junction') == "roundabout":
        return True
    return False

def get_templimit(templimit:str, streettype:str) -> int:
    if  templimit == "None":
        if (streettype == 'motorway' or streettype == 'trunk'):
            w = 130
        elif (streettype == 'motorway_link' or streettype == 'trunk_link'):
            w = 50
        elif (streettype == 'primary' or streettype == 'secondary'):
            w = 90
        elif (streettype == 'tertiary'):
            w = 70
        elif (streettype == 'primary_link' or streettype == 'secondary_link' or streettype == 'tertiary_link'):
            w = 30
        elif (streettype == 'residential'):
            w = 40
        elif  (streettype == 'living_street'):
            w = 10
        else:  
            w = 25
    elif  templimit == 'walk':
        w = 10
    elif templimit == 'none':
        w = 130
    else:
        try:
            w = int(templimit)
        except:
            w = 20
    return w

def haversine_length(nodes:list, coords:dict, r:float=6365000) -> float:
    """@param geometry: elements must contain lon and lat attribute
    @param r: radius, default Earth
    @returns: length of given geometry
    """
    length = 0
    for i in range (0, len(nodes)-1):
        lat1 = coords[nodes[i]].lat * math.pi / 180
        lat2 = coords[nodes[i+1]].lat * math.pi / 180
        lon1 = coords[nodes[i]].lon * math.pi / 180
        lon2 = coords[nodes[i+1]].lon * math.pi / 180
        a = math.sin((lat2-lat1)/2)**2
        b = math.sin((lon2-lon1)/2)**2
        length += 2*r*math.asin(math.sqrt(a+math.cos(lat1)*math.cos(lat2)*b))
    return length


class GeoJson():
    def __init__(self):
        self.type = "FeatureCollection"
        self.features = []

    def add_node(self, index, lon, lat, edgecount, edges):
        feature = {}
        feature["type"] = "Feature"
        feature["geometry"] = {"type": "Point", "coordinates": [lon, lat]}
        feature["properties"] = {"index": index, "edgecount": edgecount, "edges": edges}
        self.features.append(feature)

    def add_edge(self, index, nodeA, nodeB, weight, oneway, coords):
        feature = {}
        feature["type"] = "Feature"
        feature["geometry"] = {"type": "LineString", "coordinates": coords}
        feature["properties"] = {"index": index, "nodeA": nodeA, "nodeB": nodeB, "weight": weight, "oneway": oneway}
        self.features.append(feature)

def create_graph_file(input:str, output:str):
    edgeslist, nodesdict, coordsdict = parse_osm(input)
    file = open(output, 'wb')
    nodecount = len(nodesdict)
    file.write(struct.pack("i", nodecount))
    for node in nodesdict.values():
        coord = coordsdict[node.coord]
        file.write(struct.pack("d", coord.lon))
        file.write(struct.pack("d", coord.lat))
        edgecount = len(node.edges)
        file.write(struct.pack("i", edgecount))
        for edge in node.edges:
            file.write(struct.pack("i", edge))
    edgecount = len(edgeslist)
    file.write(struct.pack("i", edgecount))
    for edge in edgeslist:
        file.write(struct.pack("i", edge.nodeA))
        file.write(struct.pack("i", edge.nodeB))
        file.write(struct.pack("d", edge.weight))
        file.write(struct.pack("?", edge.oneway))
        nodecount = len(edge.coords)
        file.write(struct.pack("i", nodecount))
        for node in edge.coords:
            coord = coordsdict[node]
            file.write(struct.pack("d", coord.lon))
            file.write(struct.pack("d", coord.lat))
    file.close()

def inspect_graphfile(input:str):
    file = open(input, 'rb')
    nodecount = struct.unpack("i", file.read(4))[0]
    c = 0
    for i in range(0, nodecount):
        lon = struct.unpack("d", file.read(8))[0]
        lat = struct.unpack("d", file.read(8))[0]
        edgecount = struct.unpack("i", file.read(4))[0]
        edges = []
        for i in range(0, edgecount):
            edges.append(struct.unpack("i", file.read(4))[0])
        if c%1000 == 0:
            print(f"Node: lon = {lon}, lat = {lat}, edgecount = {edgecount}")
        c+=1
    edgecount = struct.unpack("i", file.read(4))[0]
    c = 0
    for i in range(0, edgecount):
        nodeA = struct.unpack("i", file.read(4))[0]
        nodeB = struct.unpack("i", file.read(4))[0]
        weight = struct.unpack("d", file.read(8))[0]
        oneway = struct.unpack("?", file.read(1))[0]
        nodecount = struct.unpack("i", file.read(4))[0]
        nodes = []
        for i in range(0, nodecount):
            lon = struct.unpack("d", file.read(8))[0]
            lat = struct.unpack("d", file.read(8))[0]
            nodes.append([lon, lat])
        if c%1000 == 0:
            print(f"Edge: nodeA = {nodeA}, nodeB = {nodeB}, weight = {weight}, oneway = {oneway}, nodecount = {nodecount}")
        c+=1

def graphfile_to_geojson(input:str, output:str):
    file = open(input, 'rb')
    geojson = GeoJson()
    nodecount = struct.unpack("i", file.read(4))[0]
    for i in range(0, nodecount):
        lon = struct.unpack("d", file.read(8))[0]
        lat = struct.unpack("d", file.read(8))[0]
        edgecount = struct.unpack("i", file.read(4))[0]
        edges = []
        for j in range(0, edgecount):
            edges.append(struct.unpack("i", file.read(4))[0])
        geojson.add_node(i, lon, lat, edgecount, edges)
    with open('nodes.json', 'w') as f:
        json.dump(geojson.__dict__, f)
    geojson = GeoJson()
    edgecount = struct.unpack("i", file.read(4))[0]
    for i in range(0, edgecount):
        nodeA = struct.unpack("i", file.read(4))[0]
        nodeB = struct.unpack("i", file.read(4))[0]
        weight = struct.unpack("d", file.read(8))[0]
        oneway = struct.unpack("?", file.read(1))[0]
        nodecount = struct.unpack("i", file.read(4))[0]
        nodes = []
        for j in range(0, nodecount):
            lon = struct.unpack("d", file.read(8))[0]
            lat = struct.unpack("d", file.read(8))[0]
            nodes.append([lon, lat])
        geojson.add_edge(i, nodeA, nodeB, weight, oneway, nodes)
    with open('edges.json', 'w') as f:
        json.dump(geojson.__dict__, f)

def main(args):
    if not os.path.isfile(args.input):
        print("pls specify a valid input")
        return
    if args.inspect:
        inspect_graphfile(args.input)
        return
    inputname = os.path.basename(args.input).split(".")[0]
    if args.geojson:
        graphfile_to_geojson(args.input, inputname + "geojson")
        return
    inputfiletype = os.path.basename(args.input).split(".")[1]
    if inputfiletype not in ["osm", "o5m", "pbf"]:
        print("the given input is in the wrong format")
        return
    if args.output is None:
        args.output = inputname + ".graph"
    create_graph_file(args.input, args.output)

parser = argparse.ArgumentParser(description="define output graph")

parser.add_argument(
    '-i',
    '--input',
    action='store',
    type=str,
    help="specify path to input file (.osm/.o5m/.pbf)",
)

parser.add_argument(
    '-o',
    '--output',
    action='store',
    type=str,
    help="specify path to output file (.graph/.db)"
)

parser.add_argument(
    '--inspect',
    action='store_true',
)

parser.add_argument(
    '--geojson',
    action='store_true',
)

args = parser.parse_args()
args.input = "default.graph"
args.geojson = True

print(args)

main(args)