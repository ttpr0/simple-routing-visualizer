using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.Routing.ShortestPath;
using Simple.GeoData;

namespace Simple.Analysis.Traffic
{
    class Agent
    {
        public int timecount;
        public int nextnode;
        public int curredge;
        public int end;

        public Agent(int node, int end)
        {
            timecount = 0;
            nextnode = node;
            this.end = end;
        }

        public bool decreaseCount()
        {
            this.timecount--;
            if (timecount <= 0)
            {
                return true;
            }
            return false;
        }

        public void setCount(int count)
        { 
            this.timecount = count;
        }

        public void addEdge(int edge, int nextnode)
        {
            this.curredge = edge;
            this.nextnode = nextnode;
        }

        public int getNode()
        {
            return nextnode;
        }

        public bool finished()
        {
            if (nextnode == end)
            {
                return true;
            }
            return false;
        }
    }
}
