using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.ShortestPath
{
    interface IShortestPath
    {
        /// <summary>
        /// preforms one step of path-finding algorithm
        /// </summary>
        /// <returns>false if finished</returns>
        public bool step();

        /// <summary>
        /// should only be used after path-finding completed
        /// </summary>
        /// <returns>list of lines representing shortest path</returns>
        public List<LineD> getShortestPath();
    }
}
