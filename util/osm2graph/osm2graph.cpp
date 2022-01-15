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

struct Node;
struct Edge;
struct OsmWay;
struct OsmNode;
struct Point;
void parseOsm(std::vector<Node>* nodes, std::vector<Edge>* edges, std::unordered_map<int64_t,int>* indexmapping);
void calcEdgeWeights(std::vector<Edge>& edges);
double haversineLength(std::vector<Point>& points);
void createGraphFile(std::vector<Node>& nodes, std::vector<Edge>& edges);
Point transformMercator(double lon, double lat);
bool isOneway(bool oneway, char strtype);
char getType(std::string type);
short getTemplimit(std::string& templimit, std::string& type);

struct Point
{
    double lon;
    double lat;
};

struct OsmNode
{
    Point point;
    short count;
};

struct Edge
{
    std::vector<Point> nodes;
    double weight;
    int nodeA;
    int nodeB;
    bool oneway;
    char type;
    short templimit;
};

struct Node
{
    double lon;
    double lat;
    std::vector<int> edges;
};

class InitWayHandler : public osmium::handler::Handler
{
public:
    std::unordered_map<int64_t, OsmNode>* osmnodes;
    std::set<std::string> types = { "motorway","motorway_link","trunk","trunk_link",
        "primary","primary_link","secondary","secondary_link","tertiary","tertiary_link",
        "residential","living_street" };

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
            int c = (*this->osmnodes)[ndref.ref()].count;
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
        if (on.count > 0)
        {
            Node n;
            n.lon = node.location().lon();
            n.lat = node.location().lat();
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
    std::set<std::string> types = { "motorway","motorway_link","trunk","trunk_link",
            "primary","primary_link","secondary","secondary_link","tertiary","tertiary_link",
            "residential","living_street" };

    WayHandler(std::vector<Edge>* edges, std::unordered_map<int64_t,OsmNode>* osmnodes)
    {
        this->edges = edges;
        this->osmnodes = osmnodes;
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
            if (on.count > 0 && curr != start)
            {
                std::string templimit = way.tags().get_value_by_key("maxspeed", "");
                std::string strtype = way.tags().get_value_by_key("highway");
                e.templimit = getTemplimit(templimit, strtype);
                e.type = getType(strtype);
                if (way.tags().get_value_by_key("oneway") == "yes")
                {
                    e.oneway = true;
                }
                else
                {
                    e.oneway = false;
                }
                e.weight = start;
                e.nodeA = curr >> 32;
                e.nodeB = curr;
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
    std::unordered_map<int64_t, OsmNode> osmnodes;
    auto otypes = osmium::osm_entity_bits::way;
    osmium::io::Reader iwreader{ "data/default.pbf", otypes};
    InitWayHandler iwhandler(&osmnodes);
    osmium::apply(iwreader, iwhandler);
    iwreader.close();
    int nodecounter = 0;
    for (auto& n : osmnodes)
    {
        if (n.second.count > 0)
        {
            nodecounter++;
        }
    }
    nodes->resize(nodecounter+2);
    otypes = osmium::osm_entity_bits::node;
    osmium::io::Reader nreader{ "data/default.pbf", otypes};
    NodeHandler nhandler(&osmnodes, nodes, indexmapping);
    osmium::apply(nreader, nhandler);
    nreader.close();
    otypes = osmium::osm_entity_bits::way;
    osmium::io::Reader wreader{ "data/default.pbf", otypes };
    WayHandler whandler(edges, &osmnodes);
    osmium::apply(wreader, whandler);
    wreader.close();
    osmnodes.clear();
    edges->shrink_to_fit();
    for (int i = 0; i < edges->size(); i++)
    {
        Edge& e = (*edges)[i];
        int64_t start = e.weight;
        int64_t end = ((int64_t)e.nodeA << 32) | e.nodeB & 0xFFFFFFFFL;
        e.nodeA = (*indexmapping)[start];
        e.nodeB = (*indexmapping)[end];
    }
    for (int i = 0; i < edges->size(); i++)
    {
        Edge& e = (*edges)[i];
        (*nodes)[e.nodeA].edges.push_back(i);
        (*nodes)[e.nodeB].edges.push_back(i);
    }
}

char getType(std::string type)
{
    return 0;
}

short getTemplimit(std::string& templimit, std::string& strtype)
{
    short w;
    if (templimit == "")
    {
        if (strtype == "motorway" || strtype == "trunk")
            w = 120;
        else if (strtype == "motorway_link" || strtype == "trunk_link")
            w = 90;
        else if (strtype == "primary" || strtype == "secondary")
            w = 90;
        else if (strtype == "tertiary")
            w = 70;
        else if (strtype == "primary_link" || strtype == "secondary_link" || strtype == "tertiary_link")
            w = 30;
        else if (strtype == "residential")
            w = 40;
        else if (strtype == "living_street")
            w = 40;
        else
            w = 25;
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
            w = 20;
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
        e.weight = haversineLength(e.nodes) * 130 / e.templimit;
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

Point transformMercator(double lon, double lat)
{
    int a = 6378137;
    double x = a * lon * PI / 180;
    double y = a * log(tan(PI / 4 + lat * PI / 360));
    return { x,y };
}

bool isOneway(bool oneway, char strtype)
{
    return oneway;
}

void createGraphFile(std::vector<Node>& nodes, std::vector<Edge>& edges)
{
    std::ofstream file("default.graph", std::ios::binary);
    int nodecount = nodes.size();
    file.write(reinterpret_cast<char*>(&nodecount), 4);
    for (int i = 0; i < nodecount; i++)
    {
        Node n = nodes[i];
        Point coords = transformMercator(n.lon, n.lat);
        file.write(reinterpret_cast<char*>(&coords.lon), 8);
        file.write(reinterpret_cast<char*>(&coords.lat), 8);
        int edgecount = n.edges.size();
        file.write(reinterpret_cast<char*>(&edgecount), 4);
        for (int e : n.edges)
        {
            file.write(reinterpret_cast<char*>(&e), 4);
        }
    }
    int edgecount = edges.size();
    file.write(reinterpret_cast<char*>(&edgecount), 4);
    for (int i = 0; i < edgecount; i++)
    {
        Edge e = edges[i];
        file.write(reinterpret_cast<char*>(&e.nodeA), 4);
        file.write(reinterpret_cast<char*>(&e.nodeB), 4);
        file.write(reinterpret_cast<char*>(&e.weight), 8);
        bool oneway = isOneway(e.oneway, e.type);
        file.write(reinterpret_cast<char*>(&oneway), 1);
        int nodecount = e.nodes.size();
        file.write(reinterpret_cast<char*>(&nodecount), 4);
        for (Point p : e.nodes)
        {
            Point coords = transformMercator(p.lon, p.lat);
            file.write(reinterpret_cast<char*>(&coords.lon), 8);
            file.write(reinterpret_cast<char*>(&coords.lat), 8);
        }
    }
    file.close();
}


