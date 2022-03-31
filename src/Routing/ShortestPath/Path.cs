using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;
using Simple.Routing.Graph;

namespace Simple.Routing.ShortestPath
{
    class Path
    {
        private List<int> path;
        private List<Line> lines;
        private IGraph graph;
        private IGeometry geometry;
        private IWeighting weighting;

        private int curr;
        private bool changed = false;

        public Path(IGraph graph, List<int> path)
        {
            this.graph = graph;
            this.weighting = graph.getWeighting();
            this.geometry = graph.getGeometry();
            this.path = path;
            this.curr = 1;
        }

        public List<Line> getGeometry()
        {
            if (lines == null || changed)
            {
                this.lines = new List<Line>();
                for (int i = curr; i < this.path.Count; i = i + 2)
                {
                    lines.Add(this.geometry.getEdge(path[i]));
                }
            }
            return this.lines;
        }

        public IEnumerable<int> edgeIterator()
        {
            for (int i = curr; i < this.path.Count; i = i + 2)
            {
                yield return this.path[i];
            }
        }

        public bool step()
        {
            if (curr >= this.path.Count - 2)
            {
                return false;
            }
            curr = curr + 2;
            return true;
        }

        public (int currEdge, int nextNode, int nextEdge) getCurrent()
        {
            if (curr == this.path.Count-2)
            {
                return (this.path[curr], this.path[curr + 1], -1);
            }
            return (this.path[curr], this.path[curr + 1], this.path[curr + 2]);
        }
    }
}
