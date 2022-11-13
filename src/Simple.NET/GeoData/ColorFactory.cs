using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace Simple.GeoData
{
    public class ColorFactory
    {
        private IEnumerable<Color> multicolors;
        int steps;
        private Color defaultcolor = Color.Transparent;
        public ColorFactory(Color start, Color end, int steps)
        {
            this.multicolors = getGradients(start, end, steps);
            this.steps = steps;
        }

        private IEnumerable<Color> getGradients(Color start, Color end, int steps)
        {
            float stepR = ((end.R - start.R) / (steps - 1));
            float stepG = ((end.G - start.G) / (steps - 1));
            float stepB = ((end.B - start.B) / (steps - 1));
            for (int i = 0; i < steps; i++)
            {
                yield return Color.FromArgb(100,
                                            (byte)(start.R + (stepR * i)),
                                            (byte)(start.G + (stepG * i)),
                                            (byte)(start.B + (stepB * i)));
            }
        }

        public Color getColor(int value)
        {
            if (value < 0)
            {
                return defaultcolor;
            }
            int index = (int)(value / (3600 / steps));
            if (index >= steps)
            {
                index = steps - 1;
            }
            return this.multicolors.ElementAt(index);
        }
    }
}
