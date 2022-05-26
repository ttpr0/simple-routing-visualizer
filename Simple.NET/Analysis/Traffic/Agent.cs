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
    public class Agent
    {
        public int timecount;
        public int node;
        public int curredge;
        public int end;
        private Path path;

        public Agent(int node, int end)
        {
            timecount = 0;
            this.node = node;
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
        
        public void step(AStar alg, TrafficTable traffic, IWeighting weight)
        {
            traffic.subTraffic(this.curredge);
            if (changePath(traffic))
            {
                alg.setStartEnd(this.node, this.end);
                try
                {
                    alg.calcShortestPath();
                    this.path = alg.getShortestPath();
                }
                catch (Exception)
                {
                    this.node = end;
                    return;
                }
            }
            else
            {
                this.path.step();
            }
            (this.curredge, this.node, int n) = this.path.getCurrent();
            traffic.addTraffic(this.curredge);
            this.timecount = weight.getEdgeWeight(this.curredge);
        }

        public int getEdge()
        {
            return this.curredge;
        }

        public int getNode()
        {
            return node;
        }

        public bool finished()
        {
            if (node == end)
            {
                return true;
            }
            return false;
        }

        private bool changePath(TrafficTable traffic)
        {
            if (this.path == null)
            {
                return true;
            }
            float weight = 1;
            float value = 0;
            foreach (int e in this.path.edgeIterator())
            {
                value += weight * traffic.getTraffic(e) / 20;
                weight -= 1/50;
            }
            if (value > 5)
            {
                return true;
            }
            else return false;
        }
    }
}
