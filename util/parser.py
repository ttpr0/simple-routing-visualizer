import sqlite3 as sql
from typing import List, Dict, Tuple
import osmium as osm
import math
import argparse
import os
import struct
import numpy as np
import sys

class Edge():
    __slots__ = "osmid", "nodes", "tags", "index", "weight"
    def __init__(self, id:int, nodes:list, tags:dict):
        self.osmid = id
        self.index = 0
        self.nodes = nodes
        self.tags = tags
        self.weight = 0

class Node():
    __slots__ = "index", "lon", "lat", "edges", "tags", "weight"
    def __init__(self, id:int,lon:float, lat:float, tags:dict):
        self.osmid = id
        self.index = None
        self.lon = lon
        self.lat = lat
        self.edges = []
        self.tags = tags
        self.weight = None

class EdgeNode():
    __slots__ = "lon", "lat", "tags"
    def __init__(self, lon:float, lat:float, tags:dict):
        self.lon = lon
        self.lat = lat
        self.tags = tags

class Graph():
    def __init__(self, nodes:List[Node], edges:List[Edge]):
        self.nodes = nodes
        self.edges = edges

class WayHandler(osm.SimpleHandler):
    def __init__(self, edgeslist:List[Edge], nodesdict:Dict[int,Node], graphtype):
        super(WayHandler, self).__init__()
        self.i = 0
        self.edges = edgeslist
        self.nodesdict = nodesdict
        if graphtype == "car":
            self.types = ["motorway","motorway_link","trunk","trunk_link",
            "primary","primary_link","secondary","secondary_link","tertiary","tertiary_link",
            "residential","living_street","service","track"]
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
            c = self.nodesdict.get(ndref)
            if (i == 0 or i == l-1):
                self.nodesdict[ndref] = 1
            elif c == None:
                self.nodesdict[ndref] = 0
        tags = {}
        for key, value in w.tags:
            tags[key] = value
        self.edges.append(Edge(w.id, nodes, tags))

class NodeHandler(osm.SimpleHandler):
    def __init__(self, nodesdict:Dict[int,Node]):
        super(NodeHandler, self).__init__()
        self.i = 0
        self.nodesdict = nodesdict
    def node(self, n):
        count = self.nodesdict.get(n.id)
        if count == None:
            return
        tags = {}
        if count == 0:
            node = EdgeNode(n.location.lon, n.location.lat, tags)
        else:
            node = Node(n.id, n.location.lon, n.location.lat, tags)
        self.nodesdict[n.id] = node
        self.i += 1
        if self.i % 10000 == 0:
            print(str(self.i))

def parse_osm(file:str, type:str) -> Tuple[List[Edge],Dict[int,Node]]:
    edgeslist:List[Edge] = []
    nodesdict:Dict[int, Node] = dict()
    h = WayHandler(edgeslist, nodesdict, type)
    h.apply_file(file)
    h = NodeHandler(nodesdict)
    h.apply_file(file)
    for edge in edgeslist:
        nodes = []
        for ndref in edge.nodes:
            nodes.append(nodesdict[ndref])
        edge.nodes = nodes
    split_edges(edgeslist)
    nodesdict = {key:value for key,value in nodesdict.items() if isinstance(value, Node)}
    i = 0
    for node in nodesdict.values():
        node.index = i
        i += 1
    i = 0
    for edge in edgeslist:
        edge.index = i
        i += 1  
    return edgeslist, nodesdict

def split_edges(edgelist:List[Edge]):
    for j in range(0, len(edgelist)):
        edge = edgelist[j]
        start = 0
        end = len(edge.nodes) - 1
        splitted = False
        for i in range(1, end+1):
            if isinstance(edge.nodes[i], Node):
                if i < end or (i == end and splitted):
                    splitted = True
                    newedge = Edge(edge.osmid, edge.nodes[start:i+1], edge.tags)
                    newedge.nodes[0].edges.append(newedge)
                    newedge.nodes[len(newedge.nodes)-1].edges.append(newedge)
                    edgelist.append(newedge)
                    start = i
        if splitted:
            edgelist.pop(j)
            del edge
        else:
            edge.nodes[0].edges.append(edge)
            edge.nodes[len(edge.nodes)-1].edges.append(edge)

def create_graph(file:str, type:str) -> Graph:
    edgeslist, nodesdict = parse_osm(file, type)
    for edge in edgeslist:
        edge.weight = calc_weight(haversine_length(edge.nodes), edge.tags.get('maxspeed'), edge.tags.get('highway'))
    return Graph(list(nodesdict.values()), edgeslist)

def calc_weight(length:float, templimit:str, streettype:str) -> float:
    """ approximates weight based on streettype and (if valid input given) speed limit
    """
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
    weight = length * 130 / w
    return weight

def haversine_length(geometry:list, r:float=6365000) -> float:
    """@param geometry: elements must contain lon and lat attribute
    @param r: radius, default Earth
    @returns: length of given geometry
    """
    length = 0
    for i in range (0, len(geometry)-1):
        lat1 = geometry[i].lat * math.pi / 180
        lat2 = geometry[i+1].lat * math.pi / 180
        lon1 = geometry[i].lon * math.pi / 180
        lon2 = geometry[i+1].lon * math.pi / 180
        a = math.sin((lat2-lat1)/2)**2
        b = math.sin((lon2-lon1)/2)**2
        length += 2*r*math.asin(math.sqrt(a+math.cos(lat1)*math.cos(lat2)*b))
    return length

def transform_mercator(lon:float, lat:float) -> tuple:
    """@returns tuple of transformed x and y value
    """
    a = 6378137
    x = a*lon*math.pi/180
    y = a*math.log(math.tan(math.pi/4 + lat*math.pi/360))
    return (x,y)

def is_oneway(edge:Edge):
    if edge.tags.get('oneway') == "yes":
        return True
    if edge.tags.get('oneway') == "no":
        return False
    if edge.tags.get('highway') in ["motorway","trunk"]:
        return True
    if edge.tags.get('junction') == "roundabout":
        return True
    return False

def create_graph_file(graph:Graph, output:str):
    print("test")
    file = open(output, 'wb')
    nodecount = len(graph.nodes)
    file.write(struct.pack("i", nodecount))
    for i in range(0, nodecount):
        node = graph.nodes[i]
        coords = transform_mercator(node.lon, node.lat)
        file.write(struct.pack("d", coords[0]))
        file.write(struct.pack("d", coords[1]))
        edgecount = len(node.edges)
        file.write(struct.pack("i", edgecount))
        for edge in node.edges:
            file.write(struct.pack("i", edge.index))
    edgecount = len(graph.edges)
    file.write(struct.pack("i", edgecount))
    for i in range(0, edgecount):
        edge = graph.edges[i]
        file.write(struct.pack("i", edge.nodes[0].index))
        file.write(struct.pack("i", edge.nodes[len(edge.nodes)-1].index))
        file.write(struct.pack("d", edge.weight))
        file.write(struct.pack("?", is_oneway(edge)))
        nodecount = len(edge.nodes)
        file.write(struct.pack("i", nodecount))
        for node in edge.nodes:
            coords = transform_mercator(node.lon, node.lat)
            file.write(struct.pack("d", coords[0]))
            file.write(struct.pack("d", coords[1]))
    file.close()

def main(args):
    if args.type is None:
        args.type = "car"
    if args.type not in ["car"]:
        print("pls specify a valid type (default car)")
        return
    args.input = ".\data\default.pbf"
    if not os.path.isfile(args.input):
        print("pls specify a valid input")
        return
    inputname = os.path.basename(args.input).split(".")[0]
    inputfiletype = os.path.basename(args.input).split(".")[1]
    if inputfiletype not in ["osm", "o5m", "pbf"]:
        print("the given input is in the wrong format")
        return
    graph = create_graph(args.input, args.type)
    if args.output is None:
        args.output = inputname + ".graph"
    create_graph_file(graph, args.output)

parser = argparse.ArgumentParser(description="define output graph")

parser.add_argument(
    '-i'
    '--input',
    type=str,
    help="specify path to input file (.osm/.o5m/.pbf)"
)

parser.add_argument(
    '-o',
    '--output',
    type=str,
    help="specify path to output file (.graph/.db)"
)

parser.add_argument(
    '-t',
    '--type',
    type=str,
    help="specify type of graph (car, bicycle, pedestrian), default car"
)

args = parser.parse_args()

main(args)


"""
for i in range(0, 10):
    way = osmways[i]
    print(f"oneway: {way.oneway}, type: {way.type}, templimit: {way.templimit}")

nodelist = list(nodes.values())
for i in range(0, 10):
    node = nodelist[i]
    print(f"lon: {node.lon}, lat: {node.lat}")
"""