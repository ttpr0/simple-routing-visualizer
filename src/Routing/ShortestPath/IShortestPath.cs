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
        /// calculates shortest path
        /// </summary>
        /// <returns>true if successfull</returns>
        public bool calcShortestPath();

        /// <summary>
        /// performs a number of steps, visited edges are stored in list
        /// </summary>
        /// <param name="count">number of steps to be perfomed</param>
        /// <param name="visitededges">visited edges are added to this list</param>
        /// <returns>false if finished</returns>
        public bool steps(int count, List<ICoordArray> visitededges);

        /// <summary>
        /// should only be used after path-finding completed
        /// </summary>
        /// <returns>list of lines representing shortest path</returns>
        public Path getShortestPath();
    }
}
