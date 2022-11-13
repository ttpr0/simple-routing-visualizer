using System;
using System.Collections.Generic;
using System.Diagnostics;
using static CH;

Console.WriteLine("Hello, World!");

Graph graph = new Graph();
//Graph graph = loadGraph("data/berlin.graph");

// add random nodes and edges
Console.WriteLine("add Nodes and Edges to Graph");
var rand = new Random(DateTime.Now.Millisecond);
//int node_count = graph.nodeCount();
//int edge_count = graph.edgeCount();
int node_count = 4000;
int edge_count = 8000;
for (int i=0; i<node_count; i++)
{
    graph.addNode(-1);
}
for (int i=0; i<edge_count; i++)
{
    int c = rand.Next(5, node_count-5);
    int min = c-5;
    int max = c+5;
    int from = rand.Next(min, max);
    int to = rand.Next(min, max);
    int w = rand.Next(1, 10);
    graph.addEdge(from, to, w);
}
Console.WriteLine("finished adding Nodes and Edges");

Console.WriteLine("calc shortest Path");
var edges = getShortestPath(graph, 1, 10);
//edges = getShortestPath(graph, 815, 999);
//edges = getShortestPath(graph, 100, 222);
int weight = 0;
foreach (int e in edges) {
    weight += graph.getWeight(e);
}
Console.WriteLine("weight:" + weight + " edges:{" + String.Join(",", edges) + "}");

calcContraction(graph);

Console.WriteLine("calc shortest Path");
edges = getShortestPathCH2(graph, 1, 10);
//edges = getShortestPathCH2(graph, 815, 999);
//edges = getShortestPathCH2(graph, 100, 222);
weight = 0;
foreach (int e in edges) {
    weight += graph.getWeight(e);
}
Console.WriteLine("weight:" + weight + " edges:{" + String.Join(",", edges) + "}");

Console.WriteLine("start benchmark:");
// create start and end points
var pairs = new List<(int, int)>();
for (int i=0; i<100; i++)
{
    int start = rand.Next(0, node_count);
    int end = rand.Next(0, node_count);
    var e = getShortestPath(graph, start, end);
    while (e.Count == 0)
    {
        start = rand.Next(0, node_count);
        end = rand.Next(0, node_count);
        e = getShortestPath(graph, start, end);
    }
    pairs.Add((start, end));
}
int n = 10;
var sw = new Stopwatch();

// benchmark classic shortest path
Console.WriteLine("benchmark dijkstra");
var times = new List<int>(n);
for (int i=0; i<n; i++)
{
    sw.Start();
    foreach (var (start, end) in pairs)
    {
        getShortestPath(graph, start, end);
    }
    sw.Stop();
    times.Add((int)sw.ElapsedMilliseconds);
    sw.Reset();
}
int mean = 0;
foreach (int time in times) {
    mean += time;
}
mean = mean / n;
float std = 0;
foreach (int time in times) {
    std += (float)Math.Pow(time - mean, 2);
}
std = std / (n-1);
Console.WriteLine($"mean: {mean}, std: {std}");

// benchmark ch
Console.WriteLine("benchmark contraction hirachies");
times = new List<int>(n);
for (int i=0; i<n; i++)
{
    sw.Start();
    foreach (var (start, end) in pairs)
    {
        getShortestPathCH2(graph, start, end);
    }
    sw.Stop();
    times.Add((int)sw.ElapsedMilliseconds);
    sw.Reset();
}
mean = 0;
foreach (int time in times) {
    mean += time;
}
mean = mean / n;
std = 0;
foreach (int time in times) {
    std += (float)Math.Pow(time - mean, 2);
}
std = std / (n-1);
Console.WriteLine($"mean: {mean}, std: {std}");
