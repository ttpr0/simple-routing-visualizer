using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class CH
{
    public static List<int> getLevelNodes(Graph graph, short level)
    {
        var set = new List<int>();
        int node_count = graph.nodeCount();
        for (int i=0; i < node_count; i++)
        {
            if (graph.getNodeLevel(i) >= level)
            {
                set.Add(i);
            }
        }
        return set;
    }

    public static List<int> getShortestPath(Graph graph, int start, int end, short level=-1)
    {
        var edges = new List<int>();
        var heap = new PriorityQueue<int, int>();
        heap.Enqueue(start, 0);
        var flags = new Flag[graph.nodeCount()];
        for (int i = 0; i < flags.Length; i++)
        {
            flags[i].pathlength = 1000000000;
        }
        flags[start].pathlength = 0;
        int curr_id = -1;

        while (true)
        {
            try
            {
                curr_id = heap.Dequeue();
            }
            catch (Exception)
            {
                return edges;
            }
            if (curr_id == end)
            {
                break;
            }
            Node curr = graph.getNode(curr_id);
            ref Flag currflag = ref flags[curr_id];
            if (currflag.visited)
            {
                continue;
            }
            currflag.visited = true;
            foreach (int e_id in curr.edges)
            {
                Edge edge = graph.getEdge(e_id);
                int other_id = graph.getOtherNode(e_id, curr_id);
                Node other = graph.getNode(other_id);
                ref Flag otherflag = ref flags[other_id];
                if (otherflag.visited || other.level < level)
                {
                    continue;
                }
                int newlength = currflag.pathlength + edge.weight;
                if (otherflag.pathlength > newlength)
                {
                    otherflag.prevEdge = e_id;
                    otherflag.pathlength = newlength;
                    heap.Enqueue(other_id, newlength);
                }
            }
        }

        curr_id = end;
        int edge_id;
        while (true)
        {
            if (curr_id == start)
            {
                break;
            }
            edge_id = flags[curr_id].prevEdge;
            edges.Add(edge_id);
            curr_id = graph.getOtherNode(edge_id, curr_id);
        }
        edges.Reverse();
        return edges;
    }

    public static List<int> getShortestPathCH(Graph graph, int start, int end, short level=-1)
    {
        var edges = new List<int>();
        var start_heap = new PriorityQueue<int, int>();
        start_heap.Enqueue(start, 0);
        var end_heap = new PriorityQueue<int, int>();
        end_heap.Enqueue(end, 0);
        var flags = new FlagCH[graph.nodeCount()];
        for (int i = 0; i < flags.Length; i++)
        {
            flags[i].pathlength1 = 1000000000;
            flags[i].pathlength2 = 1000000000;
        }
        flags[start].pathlength1 = 0;
        flags[end].pathlength2 = 0;
        int curr_id = -1;
        int mid_id = -1;

        while (true)
        {
            // from start
            try
            {
                curr_id = start_heap.Dequeue();
            }
            catch (Exception)
            {
                return edges;
            }
            Node curr = graph.getNode(curr_id);
            ref FlagCH currflag = ref flags[curr_id];
            if (currflag.visited1)
            {
                continue;
            }
            if (currflag.visited2)
            {
                mid_id = curr_id;
                break;
            }
            currflag.visited1 = true;
            foreach (int e_id in curr.edges)
            {
                Edge edge = graph.getEdge(e_id);
                int other_id = graph.getOtherNode(e_id, curr_id);
                Node other = graph.getNode(other_id);
                ref FlagCH otherflag = ref flags[other_id];
                if (otherflag.visited1 || other.level <= curr.level)
                {
                    continue;
                }
                int newlength = currflag.pathlength1 + edge.weight;
                if (otherflag.pathlength1 > newlength)
                {
                    otherflag.prevEdge1 = e_id;
                    otherflag.pathlength1 = newlength;
                    start_heap.Enqueue(other_id, newlength);
                }
            }

            // from end
            try
            {
                curr_id = end_heap.Dequeue();
            }
            catch (Exception)
            {
                return edges;
            }
            curr = graph.getNode(curr_id);
            currflag = ref flags[curr_id];
            if (currflag.visited2)
            {
                continue;
            }
            if (currflag.visited1)
            {
                mid_id = curr_id;
                break;
            }
            currflag.visited2 = true;
            foreach (int e_id in curr.edges)
            {
                Edge edge = graph.getEdge(e_id);
                int other_id = graph.getOtherNode(e_id, curr_id);
                Node other = graph.getNode(other_id);
                ref FlagCH otherflag = ref flags[other_id];
                if (otherflag.visited2 || other.level <= curr.level)
                {
                    continue;
                }
                int newlength = currflag.pathlength2 + edge.weight;
                if (otherflag.pathlength2 > newlength)
                {
                    otherflag.prevEdge2 = e_id;
                    otherflag.pathlength2 = newlength;
                    end_heap.Enqueue(other_id, newlength);
                }
            }
        }


        curr_id = mid_id;
        int edge_id;
        while (true)
        {
            if (curr_id == start)
            {
                break;
            }
            edge_id = flags[curr_id].prevEdge1;
            var e = new List<int>();
            getEdgesFromShortcut(e, graph, edge_id);
            edges.AddRange(e);
            curr_id = graph.getOtherNode(edge_id, curr_id);
        }
        edges.Reverse();
        curr_id = mid_id;
        while (true)
        {
            if (curr_id == end)
            {
                break;
            }
            edge_id = flags[curr_id].prevEdge2;
            var e = new List<int>();
            getEdgesFromShortcut(e, graph, edge_id);
            edges.AddRange(e);
            curr_id = graph.getOtherNode(edge_id, curr_id);
        }
        return edges;
    }

    public static List<int> getShortestPathCH2(Graph graph, int start, int end, short level=-1)
    {
        var edges = new List<int>();
        var heap = new PriorityQueue<(int, bool), int>();
        heap.Enqueue((start, true), 0);
        heap.Enqueue((end, false), 0);
        var flags = new FlagCH[graph.nodeCount()];
        for (int i = 0; i < flags.Length; i++)
        {
            flags[i].pathlength1 = 1000000000;
            flags[i].pathlength2 = 1000000000;
        }
        flags[start].pathlength1 = 0;
        flags[end].pathlength2 = 0;
        int curr_id;
        int mid_id = -1;
        bool from_start;

        while (true)
        {
            // from start
            try
            {
                (curr_id, from_start) = heap.Dequeue();
            }
            catch (Exception)
            {
                return edges;
            }
            Node curr = graph.getNode(curr_id);
            ref FlagCH currflag = ref flags[curr_id];
            if ((currflag.visited2 && from_start) || (currflag.visited1 && !from_start))
            {
                mid_id = curr_id;
                break;
            }
            if (from_start)
                currflag.visited1 = true;
            else
                currflag.visited2 = true;
            foreach (int e_id in curr.edges)
            {
                Edge edge = graph.getEdge(e_id);
                int other_id = graph.getOtherNode(e_id, curr_id);
                Node other = graph.getNode(other_id);
                ref FlagCH otherflag = ref flags[other_id];
                if ((otherflag.visited1 && from_start) || (otherflag.visited2 && !from_start))
                if (other.level <= curr.level)
                {
                    continue;
                }
                if (from_start) {
                    int newlength = currflag.pathlength1 + edge.weight;
                    if (otherflag.pathlength1 > newlength)
                    {
                        otherflag.prevEdge1 = e_id;
                        otherflag.pathlength1 = newlength;
                        heap.Enqueue((other_id, true), newlength);
                    }
                }
                else {
                    int newlength = currflag.pathlength1 + edge.weight;
                    if (otherflag.pathlength2 > newlength)
                    {
                        otherflag.prevEdge2 = e_id;
                        otherflag.pathlength2 = newlength;
                        heap.Enqueue((other_id, false), newlength);
                    }
                }
            }
        }
        curr_id = mid_id;
        int edge_id;
        while (true)
        {
            if (curr_id == start)
            {
                break;
            }
            edge_id = flags[curr_id].prevEdge1;
            var e = new List<int>();
            getEdgesFromShortcut(e, graph, edge_id);
            edges.AddRange(e);
            curr_id = graph.getOtherNode(edge_id, curr_id);
        }
        edges.Reverse();
        curr_id = mid_id;
        while (true)
        {
            if (curr_id == end)
            {
                break;
            }
            edge_id = flags[curr_id].prevEdge2;
            var e = new List<int>();
            getEdgesFromShortcut(e, graph, edge_id);
            edges.AddRange(e);
            curr_id = graph.getOtherNode(edge_id, curr_id);
        }
        return edges;
    }

    public static void getEdgesFromShortcut(List<int> edges, Graph graph, int edge_id)
    {
        var edge = graph.getEdge(edge_id);
        if (edge.is_shortcut)
        {
            var shortcut = graph.GetShortcut(edge.shortcut_id);
            foreach (int e in shortcut.edges)
            {
                getEdgesFromShortcut(edges, graph, e);
            }
        }
        else
        {
            edges.Add(edge_id);
        }
    }

    public static void calcContraction(Graph graph)
    {
        Console.WriteLine("started contracting graph");
        for (int i=0; i<graph.nodeCount(); i++)
        {
            graph.setNodeLevel(i, 0);
        }
        short level = 0;
        var nodes = getLevelNodes(graph, level);
        while (true)
        {
            int nc1 = nodes.Count;
            if (nodes.Count == 0)
            {
                break;
            }
            Console.WriteLine("start ordering nodes");
            nodes = orderNodes(graph, nodes, level);
            Console.WriteLine("finished ordering nodes");
            int ec1 = graph.edgeCount();
            contractLevel2(graph, nodes, level);
            int ec2 = graph.edgeCount();
            nodes = getLevelNodes(graph, (short)(level+1));
            int nc2 = nodes.Count;
            Console.WriteLine($"contracted level {level}: {ec2-ec1} shortcuts added, {nc1-nc2}/{nc1} nodes contracted");
            ec1 = ec2;
            level += 1;
        }
        Console.WriteLine("finished contracting graph");
    }

    public static void contractLevel(Graph graph, List<int> nodes, short level)
    {
        short new_level = (short)(level + 1);

        var rand = new Random();
        while (nodes.Count > 0)
        {
            int node_id = nodes[rand.Next(0, nodes.Count)];
            nodes.Remove(node_id);
            Node node = graph.getNode(node_id);
            var neigbours = new List<int>();
            foreach (int edge_id in node.edges)
            {
                Edge edge = graph.getEdge(edge_id);
                int other_id = graph.getOtherNode(edge_id, node_id);
                Node other = graph.getNode(other_id);
                if (other.level < level)
                {
                    continue;
                }
                neigbours.Add(other_id);
            }
            foreach (int n in neigbours)
            {
                nodes.Remove(n);
                graph.setNodeLevel(n, new_level);
            }
            
            for (int i=0; i<neigbours.Count; i++)
            {
                for (int j=i+1; j<neigbours.Count; j++)
                {
                    int from = neigbours[i];
                    int to = neigbours[j];
                    var edges = getShortestPath(graph, from, to, level);
                    bool add_shortcut = false;
                    edges.ForEach((id) => {
                        Edge e = graph.getEdge(id);
                        if (e.node_b == node_id || e.node_a == node_id) {
                            add_shortcut = true;
                        }
                    });
                    if (add_shortcut == false) {
                        continue;
                    }
                    int weight = 0;
                    foreach (int e in edges) {
                        weight += graph.getWeight(e);
                    }
                    graph.addEdge(from, to, weight, true, edges);
                }
            }
        }
    }

    public static List<int> orderNodes(Graph graph, List<int> nodes, short level)
    {
        int[] counts = new int[nodes.Count];
        var mapping = new Dictionary<int, int>();
        for (int i=0; i<nodes.Count; i++)
        {
            mapping[nodes[i]] = i;
        }

        var rand = new Random(DateTime.Now.Millisecond);
        int n = 1;
        if (nodes.Count > 50000)
            n = 25;
        else if (nodes.Count > 20000)
            n = 10;
        else if (nodes.Count > 6000)
            n = 3;
        for (int i=0; i<nodes.Count/n; i++)
        {
            int start = nodes[rand.Next(0, nodes.Count)];
            int end = nodes[rand.Next(0, nodes.Count)];
            var edges = getShortestPath(graph, start, end, level);
            foreach (int e_id in edges)
            {
                Edge edge = graph.getEdge(e_id);
                counts[mapping[edge.node_a]] += 1;
                counts[mapping[edge.node_b]] += 1;
            }
        }

        var out_list = nodes.OrderBy((i) => {
            return counts[mapping[i]];
        }).ToList();
        return out_list;
    }

    public static void contractLevel2(Graph graph, List<int> nodes, short level)
    {
        short new_level = (short)(level + 1);

        while (nodes.Count > 0)
        {
            int node_id = nodes[0];
            nodes.Remove(node_id);
            Node node = graph.getNode(node_id);
            var neigbours = new List<int>();
            foreach (int edge_id in node.edges)
            {
                Edge edge = graph.getEdge(edge_id);
                int other_id = graph.getOtherNode(edge_id, node_id);
                Node other = graph.getNode(other_id);
                if (other.level < level)
                {
                    continue;
                }
                neigbours.Add(other_id);
            }
            foreach (int n in neigbours)
            {
                nodes.Remove(n);
                graph.setNodeLevel(n, new_level);
            }
            
            for (int i=0; i<neigbours.Count; i++)
            {
                for (int j=i+1; j<neigbours.Count; j++)
                {
                    int from = neigbours[i];
                    int to = neigbours[j];
                    var edges = getShortestPath(graph, from, to, level);
                    bool add_shortcut = false;
                    edges.ForEach((id) => {
                        Edge e = graph.getEdge(id);
                        if (e.node_b == node_id || e.node_a == node_id) {
                            add_shortcut = true;
                        }
                    });
                    if (add_shortcut == false) {
                        continue;
                    }
                    int weight = 0;
                    foreach (int e in edges) {
                        weight += graph.getWeight(e);
                    }
                    graph.addEdge(from, to, weight, true, edges);
                }
            }
        }
    }

    public static Graph loadGraph(string url)
    {
        Graph graph = new Graph();

        FileInfo f = new FileInfo(url);
        if (!f.Exists || f.Name.Split(".")[1] != "graph")
        {
            throw new FileNotFoundException("specified path doesnt meet requirements");
        }
        string filename = f.Name.Split(".")[0];
        Byte[] graphdata = File.ReadAllBytes(url);
        MemoryStream graphstream = new MemoryStream(graphdata);
        BinaryReader graphreader = new BinaryReader(graphstream);
        int nodecount = graphreader.ReadInt32();
        int edgecount = graphreader.ReadInt32();
        int startindex = 8 + nodecount * 5 + edgecount * 8;
        MemoryStream edgerefstream = new MemoryStream(graphdata, startindex, graphdata.Length - startindex);
        BinaryReader edgerefreader = new BinaryReader(edgerefstream);
        for (int i = 0; i < nodecount; i++)
        {
            int s = graphreader.ReadInt32();
            sbyte c = graphreader.ReadSByte();
            for (int j = 0; j < c; j++)
            {
                edgerefreader.ReadInt32();
            }
            graph.addNode(-1);
        }
        for (int i = 0; i < edgecount; i++)
        {
            int start = graphreader.ReadInt32();
            int end = graphreader.ReadInt32();
            graph.addEdge(start, end, -1);
        }
        graphreader.Close();
        edgerefreader.Close();
        graphstream.Close();
        edgerefstream.Close();

        Byte[] weightdata = File.ReadAllBytes(f.DirectoryName + "/" + filename + "-weight");
        MemoryStream weightstream = new MemoryStream(weightdata);
        BinaryReader weightreader = new BinaryReader(weightstream);
        for (int i = 0; i < edgecount; i++)
        {
            graph.setWeight(i, weightreader.ReadByte());
        }
        weightreader.Close();
        weightstream.Close();
        
        return graph;
    }
}

struct Flag
{
    public int pathlength;
    public int prevEdge;
    public bool visited;
}

struct FlagCH
{
    public int pathlength1;
    public int prevEdge1;
    public bool visited1;

    public int pathlength2;
    public int prevEdge2;
    public bool visited2;
}