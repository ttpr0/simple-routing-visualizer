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
    public class Simulation
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
                a.timecount = i;
                this.agents.Add(a);
            }
        }

        public Simulation(IGraph graph, int agentscount)
        {
            this.graph = graph;
            this.weight = graph.getWeighting();
            this.traffic = graph.getTraffic();
            this.alg = new AStar(this.graph, 0, 0);
            this.agents = new List<Agent>();
            int nc = this.graph.nodeCount();
            Random rnd = new Random();
            for (int i = 0; i < agentscount; i++)
            {
                Agent a = new Agent(rnd.Next(10, 1000), rnd.Next(10, 1000));
                a.timecount = i;
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
                    agent.step(alg, this.traffic, this.weight);
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
