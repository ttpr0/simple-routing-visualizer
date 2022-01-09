using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    [Obsolete]
    interface INode
    {
        int getID();
        void setVisited(bool visited);
        bool isVisited();
    }
}
