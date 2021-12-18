using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct EdgeData
    {
        public bool oneway;
        public double weight;
        public string type;
        public bool important;
    }
}
