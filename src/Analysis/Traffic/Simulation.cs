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
    class Simulation
    {
        private IGraph graph;
        private IWeighting weight;
        private TrafficTable traffic;
        private AStar alg;
        private List<Agent> agents;
        private bool tc = false;

        public Simulation(IGraph graph, int agentscount, int start, int end)
        {
            this.graph = graph;
            this.weight = graph.getWeighting();
            this.traffic = graph.getTraffic();
            this.alg = new AStar(this.graph, start, end);
            this.agents = new List<Agent>();
            for (int i = 0; i < agentscount; i++)
            {
                Agent a = new Agent(start, end);
                this.agents.Add(a);
            }
        }

        public bool step()
        {
            bool changed = false;
            foreach (Agent agent in this.agents)
            {
                if (agent.finished())
                {
                    continue;
                }
                changed = true;
                if (agent.decreaseCount())
                {
                    this.traffic.subTraffic(agent.curredge);
                    this.alg.setStartEnd(agent.nextnode, agent.end);
                    this.alg.calcShortestPath();
                    int e = this.alg.getNextEdge();
                    agent.addEdge(e, this.graph.getOtherNode(e, agent.nextnode));
                    agent.setCount(this.weight.getEdgeWeight(e));
                    this.traffic.addTraffic(agent.curredge);
                    this.tc = true;
                }
            }
            return changed;
        }

        public bool draw()
        {
            if (this.tc)
            {
                this.tc = false;
                return true;
            }
            return false;
        }
    }
}
