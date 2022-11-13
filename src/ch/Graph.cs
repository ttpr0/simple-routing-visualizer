using System;
using System.Collections.Generic;

class Graph
{
    List<Node> nodes;
    List<Edge> edges;
    List<Shortcut> shortcuts;

    public Graph()
    {
        this.nodes = new List<Node>(1000);
        this.edges = new List<Edge>(1000);
        this.shortcuts = new List<Shortcut>(1000);
    }

    public void addNode(short level)
    {
        Node node = new Node(this.nodes.Count, level);
        this.nodes.Add(node);
    }

    public void addEdge(int node_a, int node_b, int weight, bool is_shortcut = false, List<int> shortcut_edges = null)
    {
        if (node_a == node_b)
        {
            return;
        }
        
        if (is_shortcut)
        {
            Edge edge = new Edge(this.edges.Count, node_a, node_b, weight, true, this.shortcuts.Count);
            this.edges.Add(edge);
            this.nodes[node_a].edges.Add(edge.id);
            this.nodes[node_b].edges.Add(edge.id);
            this.shortcuts.Add(new Shortcut(node_a, shortcut_edges));
        }
        else
        {
            Edge edge = new Edge(this.edges.Count, node_a, node_b, weight);
            this.edges.Add(edge);
            this.nodes[node_a].edges.Add(edge.id);
            this.nodes[node_b].edges.Add(edge.id);
        }
    }

    public Edge getEdge(int id)
    {
        return this.edges[id];
    }
    public int edgeCount()
    {
        return this.edges.Count;
    }

    public int getWeight(int id)
    {
        return this.edges[id].weight;
    }

    public void setWeight(int id, int weight)
    {
        var edge = this.edges[id];
        edge.weight = weight;
        this.edges[id] = edge;
    }

    public int getOtherNode(int edge, int node)
    {
        Edge e = this.edges[edge];
        if (e.node_a == node) {
            return e.node_b;
        }
        else {
            return e.node_a;
        }
    }

    public Node getNode(int id)
    {
        return this.nodes[id];
    }

    public int nodeCount()
    {
        return this.nodes.Count;
    }

    public short getNodeLevel(int id)
    {
        return this.nodes[id].level;
    }

    public void setNodeLevel(int id, short level)
    {
        var node = this.nodes[id];
        node.level = level;
        this.nodes[id] = node;
    }

    public Shortcut GetShortcut(int id)
    {
        return this.shortcuts[id];
    }

    public void resetContraction()
    {
        for (int i=0; i< this.nodes.Count; i++)
        {
            setNodeLevel(i, -1);
        }
        this.edges.RemoveAll((edge) => edge.is_shortcut);
        this.shortcuts.Clear();
    }
}

struct Edge
{
    public int id;
    public int node_a;
    public int node_b;
    public int weight;
    public bool is_shortcut;
    public int shortcut_id;

    public Edge(int id, int node_a, int node_b, int weight, bool is_shortcut = false, int shortcut_id = -1)
    {
        this.id = id;
        this.node_a = node_a;
        this.node_b = node_b;
        this.weight = weight;
        this.is_shortcut = is_shortcut;
        this.shortcut_id = shortcut_id;
    }
}

struct Node
{
    public int id;
    public List<int> edges;
    public short level;

    public Node(int id, short level)
    {
        this.id = id;
        this.edges = new List<int>(3);
        this.level = level;
    }
}

struct Shortcut
{
    public int start;
    public List<int> edges;

    public Shortcut(int start, List<int> edges)
    {
        this.start = start;
        this.edges = edges;
    }
}