using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;
using System.IO;
using System.Diagnostics;
using System.Globalization;
using System.Threading;
using Simple.GeoData;
using Simple.Routing.Graph;
using Simple.Routing.ShortestPath;
using Simple.Maps;
using Simple.Maps.TileMap; 
using Microsoft.Data.Sqlite;
using Simple.Routing.Isodistance;

namespace RoutingVisualizer
{
    /// <summary>
    /// basic Form window
    /// </summary>
    public partial class NavForm : Form
    {
        private bool haschanged;
        /// <summary>
        /// used to trigger map to be redrawn
        /// </summary>
        private void changed()
        {
            haschanged = true;
        }

        private TileMap tilemap;
        private GraphMap graphmap;
        private UtilityMap utilitymap;
        private BaseGraph graph;
        private PointD upperleft = new PointD(1314905, 6716660);
        private int zoom = 12;
        private GeometryContainer container = new GeometryContainer();
        private Bitmap screen = new Bitmap(1000, 600);
        Graphics g;
        private bool drawrouting = false;

        public NavForm()
        {
            InitializeComponent();
        }

        /// <summary>
        /// loads Graph and Maps
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Form1_Load(object sender, EventArgs e)
        {
            CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;
            g = Graphics.FromImage(screen);
            txtstart.Text = "100";
            txtend.Text = "20000";
            cbxShortestPath.Text = "Djkstra";
            this.tilemap = new TileMap(1000, 600);
            this.tilemap.getFactory().changed += this.changed;
            GraphFactory f = new GraphFactory();
            Stopwatch sw = new Stopwatch();
            sw.Start();
            this.graph = f.loadBaseGraph("data/niedersachsen.graph");
            sw.Stop();
            appendNewLine(Convert.ToString(sw.ElapsedMilliseconds));
            container.startnode = graph.getGeometry().getNode(Convert.ToInt32(txtstart.Text));
            container.endnode = graph.getGeometry().getNode(Convert.ToInt32(txtend.Text));
            this.graphmap = new GraphMap(1000, 600);
            this.utilitymap = new UtilityMap(1000, 600, this.container);
            haschanged = true;
            //drawMap();
        }

        /// <summary>
        /// converts web-mercator to screen coordinates using curr upperleft
        /// </summary>
        /// <param name="point"></param>
        /// <param name="tilesize"></param>
        /// <returns>converted point</returns>
        private Point realToScreen(PointD point, double tilesize)
        {
            double x = (point.lon - upperleft.lon) * 256 / tilesize;
            double y = -(point.lat - upperleft.lat) * 256 / tilesize;
            return new Point((int)x, (int)y);
        }

        /// <summary>
        /// converts screen to web-mercator coordinates using curr upperleft
        /// </summary>
        /// <param name="point"></param>
        /// <param name="tilesize"></param>
        /// <returns>converted point</returns>
        private PointD screenToReal(Point point, double tilesize)
        {
            double x = upperleft.lon + point.X * tilesize / 256;
            double y = upperleft.lat - point.Y * tilesize / 256;
            return new PointD(x, y);
        }

        /// <summary>
        /// timer used to redraw maps if haschanged == true
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void timerDrawPbx_Tick(object sender, EventArgs e)
        {
            if (haschanged)
            {
                haschanged = false;
                drawMap();
            }
        }

        /// <summary>
        /// redraws all Maps
        /// </summary>
        private void drawMap()
        {
            if (InvokeRequired)
            {
                this.Invoke(new Action(drawMap), new object[] { });
                return;
            }
            g.Clear(Color.White);
            g.DrawImage(tilemap.createMap(upperleft, zoom), 0, 0);
            g.DrawImage(utilitymap.createMap(upperleft, zoom), 0, 0);
            if (this.drawrouting)
            {
                g.DrawImage(graphmap.createMap(upperleft, zoom), 0, 0);
            }
            pbxout.Image = screen;
            pbxout.Refresh();
        }

        /// <summary>
        /// writes str to TextBox
        /// </summary>
        /// <param name="str"></param>
        private void appendNewLine(string str)
        {
            txtout.AppendText(str + "\r\n");
        }

        /// <summary>
        /// runs shortest path algorithm,
        /// if draw search is set visted edges are darwn
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnRunShortestPath_Click(object sender, EventArgs e)
        {
            container.path = null;
            container.valuepoints = null;
            container.polygon = null;
            container.mgimg = null;
            int start;
            int end;
            try
            {
                start = Convert.ToInt32(txtstart.Text);
                end = Convert.ToInt32(txtend.Text);
            }
            catch (Exception)
            {
                appendNewLine("pls insert valid ID");
                return;
            }
            if (!graph.isNode(start) || !graph.isNode(end))
            {
                appendNewLine("pls insert valid Node-ID");
                return;
            }
            else
            {
                container.startnode = graph.getGeometry().getNode(Convert.ToInt32(txtstart.Text));
                container.endnode = graph.getGeometry().getNode(Convert.ToInt32(txtend.Text));
            }
            haschanged = true;
            //drawMap();
            IShortestPath algorithm;
            switch (cbxShortestPath.Text)
            {
                case "Djkstra":
                    algorithm = new Dijkstra(this.graph, start, end);
                    break;
                case "A*":
                    algorithm = new AStar(this.graph, start, end);
                    break;
                case "Bidirect-Djkstra":
                    algorithm = new BidirectDijkstra(this.graph, start, end);
                    break;
                case "Bidirect-A*":
                    algorithm = new BidirectAStar(this.graph, start, end);
                    break;
                default:
                    algorithm = new Dijkstra(this.graph, start, end);
                    break;
            }
            Stopwatch sw = new Stopwatch();
            sw.Start();
            bool draw = chbxDraw.Checked;
            if (draw)
            {
                this.drawrouting = true;
                int j = 500;
                List<LineD> lines = new List<LineD>();
                while (algorithm.steps(j, lines))
                {
                    if (draw)
                    {
                        this.graphmap.addLines(lines);
                        drawMap();
                        lines.Clear();
                    }
                }
            }
            else
            {
                algorithm.calcShortestPath();
            }
            sw.Stop();
            this.drawrouting = false;
            appendNewLine(sw.ElapsedMilliseconds.ToString());
            appendNewLine("finished");
            container.path = algorithm.getShortestPath();
            graphmap.clearMap();
            haschanged = true;
            //drawMap();
        }

        private void btnRunMultiGraph_Click(object sender, EventArgs e)
        {
            container.path = null;
            container.valuepoints = null;
            container.polygon = null;
            container.mgimg = null;
            int start;
            try
            {
                start = Convert.ToInt32(txtstart.Text);
            }
            catch (Exception)
            {
                appendNewLine("pls insert valid ID");
                return;
            }
            if (!graph.isNode(start))
            {
                appendNewLine("pls insert valid Node-ID");
                return;
            }
            else
            {
                container.startnode = graph.getGeometry().getNode(Convert.ToInt32(txtstart.Text));
                container.endnode = graph.getGeometry().getNode(Convert.ToInt32(txtend.Text));
            }
            haschanged = true;
            //drawMap();
            MultiGraph mg = new MultiGraph(this.graph, start, 3600);
            Stopwatch sw = new Stopwatch();
            sw.Start();
            mg.calcMultiGraph();
            sw.Stop();
            this.drawrouting = false;
            appendNewLine(sw.ElapsedMilliseconds.ToString());
            appendNewLine("finished");
            
            sw.Restart();
            Raster raster = new Raster(new PointD(708071.8, 7186169.6), 2500, 2500, 200);
            raster.valuesFromPointCloud(mg.getMultiGraph());
            sw.Stop();
            appendNewLine(sw.ElapsedMilliseconds.ToString());
            sw.Restart();
            container.mgimg = new RasterImage(raster, new ColorFactory(Color.Green, Color.Red, 12));
            sw.Stop();
            appendNewLine(sw.ElapsedMilliseconds.ToString());
            /*
            container.valuepoints = mg.getMultiGraph();
            */
            haschanged = true;
            //drawMap();
        }


        private bool mousedown = false;
        private int mousex = 0;
        private int mousey = 0;
        private PointD ul = new PointD(0, 0);
        private PointD clickpoint = new PointD(0, 0);
        private void pbxout_MouseDown(object sender, MouseEventArgs e)
        {
            mousedown = true;
            mousex = e.X;
            mousey = e.Y;
            ul = upperleft;
            haschanged = true;
        }
        private void pbxout_MouseUp(object sender, MouseEventArgs e)
        {
            haschanged = true;
            mousedown = false;
        }
        private void pbxout_MouseMove(object sender, MouseEventArgs e)
        {
            if (!mousedown)
            {
                return;
            }

            double tilesize = 40075016.69 / Math.Pow(2, zoom);
            upperleft.lon = ul.lon + (mousex - e.X) * tilesize / 256;
            upperleft.lat = ul.lat + (e.Y - mousey) * tilesize / 256;

            haschanged = true;
        }
        private void pbxout_MouseWheel(object sender, MouseEventArgs e)
        {
            double tilesize = 40075016.69 / Math.Pow(2, zoom);
            double realX = upperleft.lon + (e.X * tilesize / 256);
            double realY = upperleft.lat - (e.Y * tilesize / 256);
            if (zoom <= 14 && zoom >= 8)
            {
                zoom += (int)(e.Delta / 120);
                if (zoom > 14)
                {
                    zoom = 14;
                }
                if (zoom < 8)
                {
                    zoom = 8;
                }
            }
            tilesize = 40075016.69 / Math.Pow(2, zoom);
            upperleft.lon = realX - (e.X * tilesize / 256);
            upperleft.lat = realY + (e.Y * tilesize / 256);
            haschanged = true;
            //drawMap();
        }

        private void setStartNodeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            double distance = -1;
            long id = 0;
            double newdistance;
            IGeometry geom = graph.getGeometry();
            for (int i = 0; i < geom.getAllNodes().Length; i++)
            {
                PointD point = geom.getNode(i);
                newdistance = Math.Sqrt(Math.Pow(clickpoint.lon - point.lon, 2) + Math.Pow(clickpoint.lat - point.lat, 2));
                if (distance == -1)
                {
                    container.startnode = point;
                    distance = newdistance;
                    id = i;
                }
                if (newdistance < distance)
                {
                    distance = newdistance;
                    container.startnode = point;
                    id = i;
                }
            }
            txtstart.Text = id.ToString();
            haschanged = true;
            //drawMap();
        }

        private void setEndNodeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            double distance = -1;
            long id = 0;
            double newdistance;
            IGeometry geom = graph.getGeometry();
            for (int i = 0; i < geom.getAllNodes().Length; i++)
            {
                PointD point = geom.getNode(i);
                newdistance = Math.Sqrt(Math.Pow(clickpoint.lon - point.lon, 2) + Math.Pow(clickpoint.lat - point.lat, 2));
                if (distance == -1)
                { 
                    container.endnode = point;
                    distance = newdistance;
                    id = i;
                }
                if (newdistance < distance)
                {
                    distance = newdistance;
                    container.endnode = point;
                    id = i;
                }
            }
            txtend.Text = id.ToString();
            haschanged = true;
            //drawMap();
        }

        private void pbxout_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
            {
                double tilesize = 40075016.69 / Math.Pow(2, this.zoom);
                clickpoint = screenToReal(e.Location, tilesize);
                ctmpbx.Show(pbxout, e.Location);
            }
            haschanged = true;
        }
    }
}
