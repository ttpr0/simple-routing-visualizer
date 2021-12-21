import sqlite3 as sql
from typing import List, Dict
import osmium as osm
import math
import argparse
import os
import struct

class Edge():
    def __init__(self, id:int, start:int, end:int, oneway:bool, weight:float, _type:str, geometry:list):
        self.id = id
        self.start = start
        self.end = end
        self.oneway = oneway
        self.weight = weight
        self.type = _type
        self.geometry = geometry

class OsmWay():
    def __init__(self, oneway:bool, _type:str, templimit:str, noderefs:list):
        self.oneway = oneway
        self.type = _type
        self.templimit = templimit
        self.noderefs = noderefs

class OsmNode():
    def __init__(self, lon:float, lat:float, imp:bool):
        self.lon = lon
        self.lat = lat
        self.imp = imp

class Node():
    def __init__(self, id:int, lon:float, lat:float):
        self.id = id
        self.lon = lon
        self.lat = lat
        self.edges = []

class WayHandler(osm.SimpleHandler):
    def __init__(self, osmways, noderefs, graphtype):
        super(WayHandler, self).__init__()
        self.i = 0
        self.osmways = osmways
        self.noderefs = noderefs
        if graphtype == "car":
            self.types = ["motorway","motorway_link","trunk","trunk_link",
            "primary","primary_link","secondary","secondary_link","tertiary","tertiary_link",
            "residential","living_street","service","track"]
    def way(self, w):
        if "highway" not in w.tags:
            return
        _type = w.tags.get("highway")
        if _type not in self.types:
            return
        self.i += 1
        if self.i % 1000 == 0:
            print(str(self.i))
        if w.tags.get("oneway") == "yes":
            oneway = True
        else:
            oneway = False
        nds = [node.ref for node in w.nodes]
        _type = w.tags.get("highway")
        templimit = w.tags.get("maxspeed")
        way = OsmWay(oneway, _type, templimit, nds)
        self.osmways.append(way)
        for n in range(0,len(nds)):
            nd = nds[n]
            if nd not in self.noderefs:
                self.noderefs[nd] = 0
            if n == 0 or n == len(nds)-1:
                self.noderefs[nd] += 1

class NodeHandler(osm.SimpleHandler):
    def __init__(self, noderefs, osmnodes, nodes):
        super(NodeHandler, self).__init__()
        self.i = 0
        self.c = 0
        self.noderefs = noderefs
        self.osmnodes = osmnodes
        self.nodes = nodes
    def node(self, n):
        if n.id in self.noderefs:
            id = n.id
            lon = n.location.lon
            lat = n.location.lat
            if  self.noderefs[n.id] == 0:
                node = OsmNode(lon, lat, False)
                self.osmnodes[id] = node
            else:
                node = OsmNode(lon, lat, True)
                self.osmnodes[id] = node
                node = Node(self.c, lon, lat)
                self.nodes[id] = node
                self.c += 1
            self.i += 1
            if self.i % 1000 == 0:
                print(str(self.i))
            
class Graph():
    def __init__(self, nodes:List[Node], edges:List[Edge]):
        self.nodes = nodes
        self.edges = edges
        self.i = 0

def extract_graph(file:str, type:str) -> Graph:
    osmways:List[OsmWay] = []
    noderefs:Dict[int, int] = dict()
    osmnodes:Dict[int, OsmNode] = dict()
    nodes:Dict[int, Node] = dict()
    h = WayHandler(osmways, noderefs, type)
    h.apply_file(file)
    h = NodeHandler(noderefs, osmnodes, nodes)
    h.apply_file(file)
    return create_graph(osmways, osmnodes, nodes)

def create_graph(osmways:List[OsmWay], osmnodes:Dict[int, OsmNode], nodes:Dict[int, Node]) -> Graph:
    c = 0
    edges = []
    for way in osmways:
        new = True
        geometry = []
        for n in range(1,len(way.noderefs)):
            if new:
                nd = way.noderefs[n-1]
                startnode = nodes[nd]
                geometry.append(osmnodes[nd])
                new = False
            nd = way.noderefs[n]
            node = osmnodes[nd]
            geometry.append(node)
            if node.imp:
                endnode = nodes[nd]
                edges.append(create_edge(c, startnode, endnode, geometry, way.oneway, way.type, way.templimit))
                startnode.edges.append(c)
                endnode.edges.append(c)
                c += 1
                new = True
                geometry.clear()
    return Graph(list(nodes.values()), edges)

def create_edge(id:int, start:Node, end:Node, geometry:List[OsmNode], oneway:bool, _type:str, templimit:str) -> Edge:
    weight = calc_weight(haversine_length(geometry), templimit, _type)
    return Edge(id, start.id, end.id, oneway, weight, _type, geometry.copy())

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

def create_graph_db(graph:Graph, output:str):
    conn = sql.connect(output)
    c = conn.cursor()
    c.execute("DROP TABLE IF EXISTS edges")
    c.execute("""CREATE TABLE edges(
        id INTEGER PRIMARY KEY,
        start INTEGER,
        end INTEGER,
        weight REAL,
        oneway BOOLEAN,
        type TEXT,
        geometry TEXT
    )""")
    for edge in graph.edges:
        geometry = ""
        for node in edge.geometry:
            coords = transform_mercator(node.lon, node.lat)
            geometry += str(coords[0]) + ";" + str(coords[1]) + "&&"
        if edge.oneway:
            oneway = 1
        else:
            oneway = 0
        c.execute(f"INSERT INTO edges VALUES ({edge.id}, {edge.start}, {edge.end}, {edge.weight}, {oneway}, '{edge.type}', '{geometry}');")
    c.execute("DROP TABLE IF EXISTS nodes")
    c.execute("""CREATE TABLE nodes(
        id INTEGER PRIMARY KEY,
        x REAL,
        y REAL,
        edges TEXT
    )""")
    for node in graph.nodes:
        coords = transform_mercator(node.lon, node.lat)
        edges = ""
        for edge in node.edges:
            edges += str(edge) + "&&"
        c.execute(f"INSERT INTO nodes VALUES ({node.id}, {coords[0]}, {coords[1]}, '{edges}');")
    conn.commit()
    conn.close()

def create_graph_file(graph:Graph, output:str):
    print("test")
    file = open(output, 'wb')
    nodecount = len(graph.nodes)
    file.write(struct.pack("i", nodecount))
    for node in graph.nodes:
        coords = transform_mercator(node.lon, node.lat)
        file.write(struct.pack("d", coords[0]))
        file.write(struct.pack("d", coords[1]))
        edgecount = len(node.edges)
        file.write(struct.pack("i", edgecount))
        for edge in node.edges:
            file.write(struct.pack("i", edge))
    edgecount = len(graph.edges)
    file.write(struct.pack("i", edgecount))
    for edge in graph.edges:
        file.write(struct.pack("i", edge.start))
        file.write(struct.pack("i", edge.end))
        file.write(struct.pack("d", edge.weight))
        file.write(struct.pack("?", edge.oneway))
        nodecount = len(edge.geometry)
        file.write(struct.pack("i", nodecount))
        for node in edge.geometry:
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
    args.input = ".\data\sachsen-anhalt.o5m"
    if not os.path.isfile(args.input):
        print("pls specify a valid input")
        return
    inputname = os.path.basename(args.input).split(".")[0]
    inputfiletype = os.path.basename(args.input).split(".")[1]
    if inputfiletype not in ["osm", "o5m", "pbf"]:
        print("the given input is in the wrong format")
        return
    graph = extract_graph(args.input, args.type)
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