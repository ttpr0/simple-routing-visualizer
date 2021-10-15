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
using RoutingVisualizer.NavigationGraph;
using RoutingVisualizer.TileMapRenderer;

namespace RoutingVisualizer
{
    /// <summary>
    /// basic Form window
    /// </summary>
    public partial class NavForm : Form
    {
        private static bool haschanged;
        /// <summary>
        /// used to trigger map to be redrawn
        /// </summary>
        public static void changed()
        {
            haschanged = true;
        }

        private TileMap tilemap;
        private GraphMap graphmap;
        private UtilityMap utilitymap;
        private Graph graph;
        private PointD upperleft = new PointD(1314905, 6716660);
        private int zoom = 12;
        private GeometryContainer container = new GeometryContainer();
        private Bitmap screen = new Bitmap(1000, 600);
        Graphics g;

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
            txtstart.Text = "31802460";
            txtend.Text = "270785972";
            cbxShortestPath.Text = "Djkstra";
            this.tilemap = new TileMap(1000, 600);
            this.start();
            container.startnode = graph.getNodeById(Convert.ToInt64(txtstart.Text)).getGeometry();
            container.endnode = graph.getNodeById(Convert.ToInt64(txtend.Text)).getGeometry();
            this.graphmap = new GraphMap(1000, 600, this.graph);
            this.utilitymap = new UtilityMap(1000, 600, this.container);
            haschanged = true;
            //drawMap();
        }

        /// <summary>
        /// loads and initializes graph from xml file,
        /// </summary>
        private void start()
        {
            int i = 0;
            XElement data = readXmlFile("data/graphnodes.xml", "nodes");
            SortedDictionary<long, GraphNode> nodedict = new SortedDictionary<long, GraphNode>();
            List<GraphNode> nodes = new List<GraphNode>();
            foreach (XElement node in data.Elements())
            {
                long id = Convert.ToInt64(node.Attribute("id").Value);
                double x = Convert.ToDouble(node.Attribute("x").Value);
                double y = Convert.ToDouble(node.Attribute("y").Value);
                GraphNode newnode = new GraphNode(id, new PointD(x, y));
                nodes.Add(newnode);
                nodedict.Add(id, newnode);
                i++;
                if ((i % 1000) == 0)
                {
                    appendNewLine("Fortschritt: " + i.ToString() + " / 105952");
                }
            }
            data = readXmlFile("data/graphways.xml", "ways");
            List<GraphEdge> edges = new List<GraphEdge>();
            foreach (XElement way in data.Elements())
            {
                string type = way.Attribute("type").Value;
                long id = Convert.ToInt64(way.Attribute("id").Value);
                long start = Convert.ToInt64(way.Attribute("start").Value);
                long end = Convert.ToInt64(way.Attribute("end").Value);
                bool oneway = Convert.ToBoolean(way.Attribute("oneway").Value);
                List<PointD> points = new List<PointD>();
                foreach (XElement node in way.Elements())
                {
                    points.Add(new PointD(Double.Parse(node.Attribute("x").Value), Double.Parse(node.Attribute("y").Value)));
                }
                GraphNode a = nodedict[start];
                GraphNode b = nodedict[end];
                GraphEdge newedge = new GraphEdge(id, new LineD(points.ToArray()), a, b, type, oneway);
                edges.Add(newedge);
                a.addGraphEdge(newedge);
                b.addGraphEdge(newedge);
                i++;
                if ((i % 1000) == 0)
                {
                    appendNewLine("Fortschritt: " + i.ToString() + " / 105952");
                }
            }
            graph = new Graph(nodes, edges);
        }

        /// <summary>
        /// converts web-mercator to screen coordinates using curr upperleft
        /// </summary>
        /// <param name="point"></param>
        /// <param name="tilesize"></param>
        /// <returns>converted point</returns>
        private Point realToScreen(PointD point, double tilesize)
        {
            double x = (point.X - upperleft.X) * 256 / tilesize;
            double y = -(point.Y - upperleft.Y) * 256 / tilesize;
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
            double x = upperleft.X + point.X * tilesize / 256;
            double y = upperleft.Y - point.Y * tilesize / 256;
            return new PointD(x, y);
        }

        private int i = 1;
        /// <summary>
        /// timer used to redraw maps if haschanged == true
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void timerDrawPbx_Tick(object sender, EventArgs e)
        {
            if (haschanged)
            {
                drawMap();
                i++;
                if (i % 5 == 0)
                {
                    haschanged = false;
                    i = 1;
                }
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
            g.DrawImage(graphmap.createMap(upperleft, zoom), 0, 0);
            pbxout.Image = screen;
            pbxout.Refresh();
        }

        /// <summary>
        /// used to read xml file
        /// </summary>
        /// <param name="filename">location of xml file</param>
        /// <param name="elementname">name of base element of xml file</param>
        /// <returns>XElement containign xml data from file</returns>
        private XElement readXmlFile(string filename, string elementname)
        {
            string xmlfile = File.ReadAllText(filename);
            XDocument doc = XDocument.Parse(xmlfile);
            return doc.Element(elementname);
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
            graph.initGraph();
            long startid;
            long endid;
            GraphNode start;
            GraphNode end;
            try
            {
                startid = Convert.ToInt64(txtstart.Text);
                endid = Convert.ToInt64(txtend.Text);
            }
            catch (Exception)
            {
                appendNewLine("pls insert valid ID");
                return;
            }
            if (graph.getNodeById(startid) == null || graph.getNodeById(endid) == null)
            {
                appendNewLine("pls insert valid Node-ID");
                return;
            }
            else
            {
                start = graph.getNodeById(startid);
                end = graph.getNodeById(endid);
                container.startnode = start.getGeometry();
                container.endnode = end.getGeometry();
            }
            haschanged = true;
            //drawMap();
            ShortestPathInterface algorithm;
            switch (cbxShortestPath.Text)
            {
                case "Djkstra":
                    algorithm = new Djkstra(start, end);
                    break;
                case "A*":
                    algorithm = new AStar(start, end);
                    break;
                case "Bidirect-Djkstra":
                    algorithm = new BidirectDjkstra(start, end);
                    break;
                case "Bidirect-A*":
                    algorithm = new BidirectAStar(start, end);
                    break;
                case "Fast-A*":
                    algorithm = new FastBidirectAStar(start, end);
                    break;
                default:
                    algorithm = new Djkstra(start, end);
                    break;
            }
            Stopwatch sw = new Stopwatch();
            sw.Start();
            bool draw = chbxDraw.Checked;
            int j = 500;
            int i = 0;
            while (algorithm.step())
            {
                if (draw)
                {
                    i++;
                    if ((i % j) == 0)
                    { 
                        drawMap();
                        j += 500;
                    }
                }
            }
            sw.Stop();
            appendNewLine(sw.ElapsedMilliseconds.ToString());
            appendNewLine("finished");
            container.path = algorithm.getShortestPath();
            graphmap.clearMap();
            graph.initGraph();
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
            upperleft.X = ul.X + (mousex - e.X) * tilesize / 256;
            upperleft.Y = ul.Y + (e.Y - mousey) * tilesize / 256;

            haschanged = true;
        }
        private void pbxout_MouseWheel(object sender, MouseEventArgs e)
        {
            double tilesize = 40075016.69 / Math.Pow(2, zoom);
            double realX = upperleft.X + (e.X * tilesize / 256);
            double realY = upperleft.Y - (e.Y * tilesize / 256);
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
            upperleft.X = realX - (e.X * tilesize / 256);
            upperleft.Y = realY + (e.Y * tilesize / 256);
            haschanged = true;
            //drawMap();
        }

        private void setStartNodeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            double distance = -1;
            long id = 0;
            double newdistance;
            foreach (GraphNode node in graph.getGraphNodes())
            {
                PointD point = node.getGeometry();
                newdistance = Math.Sqrt(Math.Pow(clickpoint.X - point.X, 2) + Math.Pow(clickpoint.Y - point.Y, 2));
                if (distance == -1)
                {
                    container.startnode = point;
                    distance = newdistance;
                    id = node.getID();
                }
                if (newdistance < distance)
                {
                    distance = newdistance;
                    container.startnode = point;
                    id = node.getID();
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
            foreach (GraphNode node in graph.getGraphNodes())
            {
                PointD point = node.getGeometry();
                newdistance = Math.Sqrt(Math.Pow(clickpoint.X - point.X, 2) + Math.Pow(clickpoint.Y - point.Y, 2));
                if (distance == -1)
                {
                    container.endnode = point;
                    distance = newdistance;
                    id = node.getID();
                }
                if (newdistance < distance)
                {
                    distance = newdistance;
                    container.endnode = point;
                    id = node.getID();
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

    struct Way
    {
        public LineD line;
        public string type;
        public Way(PointD[] points, string type)
        {
            this.line = new LineD(points);
            this.type = type;
        }
    }

    struct LineD
    {
        public PointD[] points { get; }
        public LineD(PointD[] points)
        {
            this.points = points;
        }
    }

    struct PointD
    {
        public double X { get; set; }
        public double Y { get; set; }

        public PointD(double x, double y)
        {
            this.X = x;
            this.Y = y;
        }
    }
}
