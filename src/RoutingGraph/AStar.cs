using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    class AStar : ShortestPathInterface
    {
        private SortedDictionary<double, GraphNode> visited;
        private GraphNode endnode;
        private GraphNode startnode;

        public AStar(GraphNode start, GraphNode end)
        {
            this.endnode = end;
            this.startnode = start;
            this.visited = new SortedDictionary<double, GraphNode>();
            this.visited.Add(0, startnode);
            startnode.data.pathlength = 0;
        }

        private GraphNode currnode;
        private double currkey;
        public bool step()
        {
            currkey = visited.Keys.First();
            currnode = visited[currkey];
            if (currnode == endnode)
            {
                return false;
            }
            foreach (GraphEdge way in currnode.getEdges())
            {
                if (way.isVisited())
                {
                    continue;
                }
                if (way.data.oneway)
                {
                    if (way.getNodeB().getID() == currnode.getID())
                    {
                        continue;
                    }
                }
                way.setVisited(true);
                GraphNode othernode = way.getOtherNode(currnode);
                othernode.data.distance = GraphUtils.getDistance(othernode, endnode);
                double newlength = currnode.data.pathlength - currnode.data.distance + way.getWeight() + othernode.data.distance;
                if (othernode.data.pathlength > newlength)
                {
                    if (othernode.data.pathlength < 1000000)
                    {
                        visited.Remove(othernode.data.pathlength);
                    }
                    othernode.data.prevEdge = way;
                    newlength = addToVisited(newlength, othernode);
                    othernode.data.pathlength = newlength;
                }
            }
            visited.Remove(currkey);
            return true;
        }

        private double addToVisited(double newkey, GraphNode newnode)
        {
            try
            {
                visited.Add(newkey, newnode);
                return newkey;
            }
            catch (Exception)
            {
                return addToVisited(newkey + 0.00001, newnode);
            }
        }

        public List<LineD> getShortestPath()
        {
            List<LineD> waylist = new List<LineD>();
            currnode = endnode;
            GraphEdge curredge;
            while (true)
            {
                if (currnode == startnode)
                {
                    break;
                }
                curredge = currnode.data.prevEdge;
                waylist.Add(curredge.getGeomentry());
                currnode = curredge.getOtherNode(currnode);
            }
            return waylist;
        }
    }
}
