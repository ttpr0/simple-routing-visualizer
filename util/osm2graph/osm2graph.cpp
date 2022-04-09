#pragma warning(disable : 4996)

#include <iostream>
#include <set>
#include <vector>
#include <list>
#include <math.h>
#include <fstream>
#include <unordered_map>

#include <osmium/handler.hpp>
#include <osmium/io/pbf_input.hpp>
#include <osmium/osm/node.hpp>
#include <osmium/osm/way.hpp>
#include <osmium/visitor.hpp>

#define PI 3.14159265358979323846
typedef unsigned int uint;
typedef unsigned char uchar;

enum streettype
{
    motorway = 1,
    motorway_link = 2,
    trunk = 3,
    trunk_link = 4,
    primary = 5,
    primary_link = 6,
    secondary = 7,
    secondary_link = 8,
    tertiary = 9,
    tertiary_link = 10,
    residential = 11,
    living_street = 12,
    unclassified = 13,
    road = 14,
    track = 15,
};

struct Node;
struct Edge;
struct OsmWay;
struct OsmNode;
struct Point;
void parseOsm(std::vector<Node>* nodes, std::vector<Edge>* edges, std::unordered_map<int64_t,int>* indexmapping);
void calcEdgeWeights(std::vector<Edge>& edges);
double haversineLength(std::vector<Point>& points);
void createGraphFile(std::vector<Node>& nodes, std::vector<Edge>& edges);
bool isOneway(std::string& oneway, char strtype);
char getType(std::string type);
short getTemplimit(std::string& templimit, std::string& type);

struct Point
{
    float lon;
    float lat;
};

struct OsmNode
{
    Point point;
    short count;
};

struct Edge
{
    int nodeA;
    int nodeB;
    bool oneway;
    char type;
    uchar templimit;
    float length;
    uchar weight;
    std::vector<Point> nodes;
};

struct Node
{
    Point point;
    char type;
    std::vector<int> edges;
};

class InitWayHandler : public osmium::handler::Handler
{
public:
    std::unordered_map<int64_t, OsmNode>* osmnodes;
    std::set<std::string> types = { "motorway","motorway_link","trunk","trunk_link",
        "primary","primary_link","secondary","secondary_link","tertiary","tertiary_link",
        "residential","living_street","service","track", "unclassified", "road" };

    InitWayHandler(std::unordered_map<int64_t, OsmNode>* osmnodes)
    {
        this->osmnodes = osmnodes;
    }

    void way(const osmium::Way& way)
    {
        if (!way.tags().has_key("highway"))
        {
            return;
        }
        if (types.find(way.tags().get_value_by_key("highway")) == types.end())
        {
            return;
        }
        for (const osmium::NodeRef& ndref : way.nodes())
        {
            (*this->osmnodes)[ndref.ref()].count += 1;
        }
        (*this->osmnodes)[way.nodes().front().ref()].count += 1;
        (*this->osmnodes)[way.nodes().back().ref()].count += 1;
    }
};

class NodeHandler : public osmium::handler::Handler
{
public:
    std::unordered_map<int64_t, OsmNode>* osmnodes;
    std::vector<Node>* nodes;
    std::unordered_map<int64_t, int>* indexmapping;
    NodeHandler(std::unordered_map<int64_t, OsmNode>* osmnodes, std::vector<Node>* nodes, std::unordered_map<int64_t, int>* indexmapping)
    {
        this->osmnodes = osmnodes;
        this->nodes = nodes;
        this->indexmapping = indexmapping;
    }
    int c = 0;
    int i = 0;
    void node(const osmium::Node& node)
    {
        if (this->osmnodes->count(node.id()) == 0)
        {
            return;
        }
        c++;
        if (c % 1000 == 0)
        {
            std::cout << c << std::endl;
        }
        OsmNode& on = (*this->osmnodes)[node.id()];
        if (on.count > 1)
        {
            Node n;
            n.point.lon = node.location().lon();
            n.point.lat = node.location().lat();
            (*this->nodes)[i] = n;
            (*this->indexmapping)[node.id()] = i;
            i++;
        }
        on.point.lon = node.location().lon();
        on.point.lat = node.location().lat();
    }
};

class WayHandler : public osmium::handler::Handler 
{
public:
    std::vector<Edge>* edges;
    std::unordered_map<int64_t, OsmNode>* osmnodes;
    std::unordered_map<int64_t, int>* indexmapping;
    std::set<std::string> types = { "motorway","motorway_link","trunk","trunk_link",
        "primary","primary_link","secondary","secondary_link","tertiary","tertiary_link",
        "residential","living_street","service","track", "unclassified", "road" };

    WayHandler(std::vector<Edge>* edges, std::unordered_map<int64_t,OsmNode>* osmnodes, std::unordered_map<int64_t, int>* indexmapping)
    {
        this->edges = edges;
        this->osmnodes = osmnodes;
        this->indexmapping = indexmapping;
    }
    int c = 0;
    int i = 0;
    void way(const osmium::Way& way) 
    {
        if (!way.tags().has_key("highway"))
        {
            return;
        }
        if (types.find(way.tags().get_value_by_key("highway")) == types.end())
        {
            return;
        }
        c++;
        if (c%1000==0)
        {
            std::cout << c << std::endl;
        }
        Edge e;
        int64_t start = way.nodes().front().ref();
        int64_t end = way.nodes().back().ref();
        int64_t curr = 0;
        for (osmium::NodeRef nd : way.nodes())
        {
            curr = nd.ref();
            OsmNode on = (*this->osmnodes)[curr];
            e.nodes.push_back(on.point);
            if (on.count > 1 && curr != start)
            {
                std::string templimit = way.tags().get_value_by_key("maxspeed", "");
                std::string strtype = way.tags().get_value_by_key("highway");
                std::string oneway = way.tags().get_value_by_key("oneway", "");
                e.templimit = getTemplimit(templimit, strtype);
                e.type = getType(strtype);
                e.oneway = isOneway(oneway, e.type);
                e.nodeA = this->indexmapping->at(start);
                e.nodeB = this->indexmapping->at(curr);
                this->edges->push_back(e);
                i++;
                start = curr;
                e.nodes.clear();
                e.nodes.push_back(on.point);
            }
        }
    }
};

class TestHandler : public osmium::handler::Handler
{
public:
    int64_t* count;

    TestHandler(int64_t* count)
    {
        this->count = count;
    }
    void relation(const osmium::Way& way)
    {
        (*count)++;
    }
};

int main() 
{
    std::vector<Node> nodes;
    std::vector<Edge> edges;
    std::unordered_map<int64_t, int> indexmapping;
    parseOsm(&nodes, &edges, &indexmapping);
    std::cout << "edges: " << edges.size() << ", nodes: " << nodes.size() << std::endl;
    calcEdgeWeights(edges);
    createGraphFile(nodes, edges);
    return 0;
}


void parseOsm(std::vector<Node>* nodes, std::vector<Edge>* edges, std::unordered_map<int64_t, int>* indexmapping)
{
    std::string pbffile = "data/niedersachsen.pbf";
    std::unordered_map<int64_t, OsmNode> osmnodes;
    auto otypes = osmium::osm_entity_bits::way;
    osmium::io::Reader iwreader{ pbffile, otypes};
    InitWayHandler iwhandler(&osmnodes);
    osmium::apply(iwreader, iwhandler);
    iwreader.close();
    int nodecounter = 0;
    for (auto& n : osmnodes)
    {
        if (n.second.count > 1)
        {
            nodecounter++;
        }
    }
    nodes->resize(nodecounter);
    otypes = osmium::osm_entity_bits::node;
    osmium::io::Reader nreader{ pbffile, otypes};
    NodeHandler nhandler(&osmnodes, nodes, indexmapping);
    osmium::apply(nreader, nhandler);
    nreader.close();
    otypes = osmium::osm_entity_bits::way;
    osmium::io::Reader wreader{ pbffile, otypes };
    WayHandler whandler(edges, &osmnodes, indexmapping);
    osmium::apply(wreader, whandler);
    wreader.close();
    osmnodes.clear();
    edges->shrink_to_fit();
    for (int i = 0; i < edges->size(); i++)
    {
        Edge& e = (*edges)[i];
        (*nodes)[e.nodeA].edges.push_back(i);
        (*nodes)[e.nodeB].edges.push_back(i);
    }
}

char getType(std::string type)
{
    if (type == "motorway") return streettype::motorway;
    if (type == "motorway_link") return streettype::motorway_link;
    if (type == "trunk") return streettype::trunk;
    if (type == "trunk_link") return streettype::trunk_link;
    if (type == "primary") return streettype::primary;
    if (type == "primary_link") return streettype::primary_link;
    if (type == "secondary") return streettype::secondary;
    if (type == "secondary_link") return streettype::secondary_link;
    if (type == "tertiary") return streettype::tertiary;
    if (type == "tertiary_link") return streettype::tertiary_link;
    if (type == "residential") return streettype::residential; 
    if (type == "living_street") return streettype::living_street;
    if (type == "unclassified") return streettype::unclassified;
    if (type == "road") return streettype::road;
    if (type == "track") return streettype::track;
    return 0;
}

short getTemplimit(std::string& templimit, std::string& strtype)
{
    short w;
    if (templimit == "")
    {
        if (strtype == "motorway" || strtype == "trunk")
            w = 130;
        else if (strtype == "motorway_link" || strtype == "trunk_link")
            w = 80;
        else if (strtype == "primary" || strtype == "secondary")
            w = 100;
        else if (strtype == "tertiary")
            w = 80;
        else if (strtype == "primary_link" || strtype == "secondary_link" || strtype == "tertiary_link")
            w = 30;
        else if (strtype == "residential")
            w = 50;
        else if (strtype == "living_street")
            w = 20;
        else
            w = 30;
    }
    else if (templimit == "walk")
        w = 10;
    else if (templimit == "none")
        w = 130;
    else
    {
        try
        {
            w = std::stoi(templimit);
        }
        catch (const std::exception&)
        {
            w = 50;
        }
    }
    if (w == 0)
    {
        w = 20;
    }
    return w;
}

void calcEdgeWeights(std::vector<Edge>& edges)
{
    for (Edge& e : edges)
    {
        e.length = haversineLength(e.nodes);
        e.weight = (uchar)(e.length * 3.6 / e.templimit);
    }
}

double haversineLength(std::vector<Point>& points)
{
    int r = 6365000;
    double length = 0;
    Point* last = nullptr;
    for (Point& p : points)
    {
        if (last == nullptr)
        {
            last = &p;
            continue;
        }
        double lat1 = last->lat * PI / 180;
        double lat2 = p.lat * PI / 180;
        double lon1 = last->lon * PI / 180;
        double lon2 = p.lon * PI / 180;
        double a = pow(sin((lat2 - lat1) / 2), 2);
        double b = pow(sin((lon2 - lon1) / 2), 2);
        length += 2 * r * asin(sqrt(a + cos(lat1) * cos(lat2) * b));
        last = &p;
    }
    return length;
}

bool isOneway(std::string& oneway, char strtype)
{
    if (strtype == streettype::motorway || strtype == streettype::trunk || strtype == streettype::motorway_link || strtype == streettype::trunk_link)
    {
        return true;
    }
    if (oneway == "yes")
    {
        return true;
    }
    return false;
}

void createGraphFile(std::vector<Node>& nodes, std::vector<Edge>& edges)
{
    std::ofstream graphfile("default.graph", std::ios::binary);
    std::ofstream geomfile("default-geom", std::ios::binary);
    std::ofstream attribfile("default-attrib", std::ios::binary);
    std::ofstream weightfile("default-weight", std::ios::binary);
    int nodecount = nodes.size();
    graphfile.write(reinterpret_cast<char*>(&nodecount), 4);
    int edgecount = edges.size();
    graphfile.write(reinterpret_cast<char*>(&edgecount), 4);
    int c = 0;
    for (int i = 0; i < nodecount; i++)
    {
        Node n = nodes[i];
        attribfile.write(reinterpret_cast<char*>(&n.type), 1);
        geomfile.write(reinterpret_cast<char*>(&n.point.lon), 4);
        geomfile.write(reinterpret_cast<char*>(&n.point.lat), 4);
        char edges = n.edges.size();
        graphfile.write(reinterpret_cast<char*>(&c), 4);
        graphfile.write(reinterpret_cast<char*>(&edges), 1);
        c += edges * 4;
    }
    c = 0;
    for (int i = 0; i < edgecount; i++)
    {
        Edge e = edges[i];
        graphfile.write(reinterpret_cast<char*>(&e.nodeA), 4);
        graphfile.write(reinterpret_cast<char*>(&e.nodeB), 4);
        weightfile.write(reinterpret_cast<char*>(&e.weight), 1);
        attribfile.write(reinterpret_cast<char*>(&e.type), 1);
        attribfile.write(reinterpret_cast<char*>(&e.length), 4);
        attribfile.write(reinterpret_cast<char*>(&e.templimit), 1);
        attribfile.write(reinterpret_cast<char*>(&e.oneway), 1);
        uchar nodes = e.nodes.size();
        geomfile.write(reinterpret_cast<char*>(&c), 4);
        geomfile.write(reinterpret_cast<char*>(&nodes), 1);
        c += nodes * 8;
    }
    for (int i = 0; i < nodecount; i++)
    {
        Node n = nodes[i];
        for (int j = 0; j < n.edges.size(); j++)
        {
            graphfile.write(reinterpret_cast<char*>(&n.edges[j]), 4);
        }
    }
    for (int i = 0; i < edgecount; i++)
    {
        Edge e = edges[i];
        for (int j = 0; j < e.nodes.size(); j++)
        {
            geomfile.write(reinterpret_cast<char*>(&e.nodes[j].lon), 4);
            geomfile.write(reinterpret_cast<char*>(&e.nodes[j].lat), 4);
        }
    }
    graphfile.close();
    attribfile.close();
    weightfile.close();
    geomfile.close();
}


