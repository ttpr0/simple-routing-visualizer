﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    class BasicNode : INode
    {
        private int id;
        private bool visited;
        private int[] edges;
        public PointD point { get; }
        public NodeData data;

        public BasicNode(int id, PointD point)
        {
            this.id = id;
            this.point = point;
            this.visited = false;
            this.edges = new int[] { };
            this.data = new NodeData();
            this.data.pathlength = 10000000.00;
            this.data.pathlength2 = 10000000.00;
        }
        public BasicNode(int id, PointD point, int[] edges)
        {
            this.id = id;
            this.point = point;
            this.visited = false;
            this.edges = edges;
            this.data = new NodeData();
            this.data.pathlength = 10000000.00;
            this.data.pathlength2 = 10000000.00;
        }

        public int getID()
        {
            return this.id;
        }

        public void setVisited(bool visited)
        {
            this.visited = visited;
        }

        public bool isVisited()
        {
            return this.visited;
        }

        public void addEdge(int edgeid)
        {
            this.edges.Append<int>(edgeid);
        }

        public int[] getEdges()
        {
            return this.edges;
        }

        public PointD getGeometry()
        {
            return this.point;
        }
    }
}