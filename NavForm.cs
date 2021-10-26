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
using Microsoft.Data.Sqlite;

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
        private BasicGraph bgraph;
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
            txtstart.Text = "1000";
            txtend.Text = "2000";
            cbxShortestPath.Text = "Djkstra";
            this.tilemap = new TileMap(1000, 600);
            this._start();
            container.startnode = graph.getNodeById(Convert.ToInt32(txtstart.Text)).getGeometry();
            container.endnode = graph.getNodeById(Convert.ToInt32(txtend.Text)).getGeometry();
            this.graphmap = new GraphMap(1000, 600, this.graph);
            this.utilitymap = new UtilityMap(1000, 600, this.container);
            haschanged = true;
            //drawMap();
        }

        /// <summary>
        /// loads and initializes graph from xml file
        /// </summary>
        private void start()
        {
            int i = 0;
            XElement data = readXmlFile("data/graphnodes.xml", "nodes");
            SortedDictionary<long, GraphNode> nodedict = new SortedDictionary<long, GraphNode>();
            List<GraphNode> nodes = new List<GraphNode>();
            foreach (XElement node in data.Elements())
            {
                int id = Convert.ToInt32(node.Attribute("id").Value);
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
                int id = Convert.ToInt32(way.Attribute("id").Value);
                int start = Convert.ToInt32(way.Attribute("start").Value);
                int end = Convert.ToInt32(way.Attribute("end").Value);
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
        /// loads and initializes graph from db-graph
        /// </summary>
        private void _start()
        {
            SqliteConnection conn = new SqliteConnection("Data Source=data/graph.db");
            conn.Open();
            SqliteCommand cmd = conn.CreateCommand();
            //List<GraphNode> nodedict = new SortedDictionary<long, GraphNode>();
            GraphNode[] nodearr = new GraphNode[127765];
            BasicNode[] bnodearr = new BasicNode[127765];
            cmd.CommandText = $"SELECT * FROM nodes";
            var reader = cmd.ExecuteReader();
            int i = 0;
            while (reader.Read())
            {
                i++;
                int id = Convert.ToInt32(reader["id"]);
                double x = (double)reader["x"];
                double y = (double)reader["y"];
                GraphNode newnode = new GraphNode(id, new PointD(x, y));
                BasicNode bnewnode = new BasicNode(id, new PointD(x,y));
                nodearr[id] = newnode;
                bnodearr[id] = bnewnode;
                //nodedict.Add(id, newnode);
            }
            reader.Close();
            GraphEdge[] edgearr = new GraphEdge[152295];
            BasicEdge[] bedgearr = new BasicEdge[152295];
            cmd.CommandText = $"SELECT * FROM edges";
            reader = cmd.ExecuteReader();
            int j = 0;
            while (reader.Read())
            {
                j++;
                string type = (string)reader["type"];
                int id = Convert.ToInt32(reader["id"]);
                int start = Convert.ToInt32(reader["start"]);
                int end = Convert.ToInt32(reader["end"]);
                bool oneway = toBool(reader["oneway"]);
                double weight = (double)reader["weight"];
                List<PointD> points = new List<PointD>();
                
                string[] substrings = ((string)reader["geometry"]).Split("&&");
                foreach (string s in substrings)
                {
                    if (s == "")
                    {
                        continue;
                    }
                    string[] values = s.Split(";");
                    points.Add(new PointD(Convert.ToDouble(values[0]), Convert.ToDouble(values[1])));
                }
                
                //GraphNode a = nodedict[start];
                //GraphNode b = nodedict[end];
                GraphNode a = nodearr[start];
                GraphNode b = nodearr[end];
                BasicNode ba = bnodearr[start];
                BasicNode bb = bnodearr[end];
                GraphEdge newedge = new GraphEdge(id, new LineD(points.ToArray()), a, b, weight, type, oneway);
                BasicEdge bnewedge = new BasicEdge(id, start, end, weight, type, oneway);
                edgearr[id] = newedge;
                bedgearr[id] = bnewedge;
                a.addGraphEdge(newedge);
                b.addGraphEdge(newedge);
                ba.addEdge(bnewedge.getID());
                bb.addEdge(bnewedge.getID());
            }
            reader.Close();
            conn.Close();
            appendNewLine("Nodes: " + i.ToString() + " , Edges: " + j.ToString());
            List<GraphNode> nodes = nodearr.ToList<GraphNode>();
            List<GraphEdge> edges = edgearr.ToList<GraphEdge>();
            graph = new Graph(nodes, edges);
            bgraph = new BasicGraph(bnodearr, bedgearr);
        }

        private bool toBool(object obj)
        {
            long i = Convert.ToInt64(obj);
            if (i == 0)
            {
                return false;
            }
            return true;
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
            bgraph.initGraph();
            int startid;
            int endid;
            GraphNode start;
            GraphNode end;
            try
            {
                startid = Convert.ToInt32(txtstart.Text);
                endid = Convert.ToInt32(txtend.Text);
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
            IShortestPath algorithm;
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
                case "DB-A*":
                    algorithm = new DBAStar(start, end);
                    break;
                case "Basic-A*":
                    algorithm = new BasicAStar(bgraph, start.getID(), end.getID()); 
                    break;
                default:
                    algorithm = new Djkstra(start, end);
                    break;
            }
            Stopwatch sw = new Stopwatch();
            sw.Start();
            bool draw = chbxDraw.Checked;
            if (draw)
            {
                this.drawrouting = true;
            }
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
            this.drawrouting = false;
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
