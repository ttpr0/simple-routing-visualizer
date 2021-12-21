using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.ShortestPath
{
    class Path
    {
        private List<int> edges;
        private List<LineD> geometry;
        private double distance;
        private double time;

        public Path(List<int> edges, List<LineD> geometry)
        {
            this.edges = edges;
            this.geometry = geometry;
        }

        public List<LineD> getGeometry()
        {
            return this.geometry;
        }
    }
}
