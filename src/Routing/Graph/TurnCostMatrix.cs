using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct TurnCostMatrix<T>
    {
        private T[,] values;

        public TurnCostMatrix(int size)
        {
            this.values = new T[size, size];
        }

        public TurnCostMatrix(T[,] values)
        {
            this.values = values;
        }

        public T this[int i, int j]
        {
            get
            {
                int l = values.GetLength(0);
                if (i < 0 || i >= l || j < 0 || j >= l)
                {
                    return this.values[i, j];
                }
                return default(T);
            }
            set
            {
                int l = values.GetLength(0);
                if (i < 0 || i >= l || j < 0 || j >= l)
                {
                    this.values[i,j] = value;
                }
            }
        }
    }
}
