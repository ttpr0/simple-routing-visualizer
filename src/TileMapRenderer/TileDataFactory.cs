using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Xml.Linq;
using System.Drawing;
using System.Net;
using Microsoft.Data.Sqlite;
using System.Drawing.Imaging;

namespace RoutingVisualizer.TileMapRenderer
{
    /// <summary>
    /// class to get data from datasource (database) using sqlite
    /// </summary>
    class TileDataFactory
    {
        private Dictionary<string, TileData> datacache;
        object locker = new object();
        private SqliteConnection conn;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="origin">location of database</param>
        public TileDataFactory(string origin)
        {
            this.datacache = new Dictionary<string, TileData>();
            conn = new SqliteConnection("Data Source=data/tiles.db");
            conn.Open();
        }

        /// <summary>
        /// used for closing open database-connection
        /// </summary>
        ~TileDataFactory()
        {
            conn.Close();
            datacache.Clear();
        }

        /// <summary>
        /// gives back Map-Tile as Bitmap (256*256) from db
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <returns>Bitmap representing Map-Tile</returns>
        public Bitmap getTileBitmap(int x, int y, int z)
        {
            lock (locker)
            {
                int pot = (int)Math.Pow(2, z - 1);
                x = x + pot;
                y = pot - y - 1;
                SqliteCommand cmd = conn.CreateCommand();
                cmd.CommandText = @"SELECT tile FROM tiles WHERE z=" + z + " AND x=" + x + " AND y=" + y;
                Stream stream;
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        var data = (Byte[])reader["tile"];
                        stream = new MemoryStream(data);
                        return new Bitmap(stream);
                    }
                    return null;
                }
            }
        }


        //need changes
        public TileData getTileData(int x, int y, int z)
        {
            if (z > 15)
            {
                x = (int)(x * Math.Pow(2, 15 - z));
                y = (int)(y * Math.Pow(2, 15 - z));
                z = 15;
            }
            string key = x.ToString() + "_" + y.ToString() + "_" + z.ToString();
            TileData tiledata;
            if (datacache.TryGetValue(key, out tiledata))
            {
                return tiledata;
            }
            List<Way> lines = loadTileData(x, y, z, key);
            if (lines.Count == 0)
            {
                return null;
            }
            tiledata = new TileData(lines, x, y, z);
            datacache.Add(key, tiledata);
            return tiledata;
        }

        //need changes
        private List<Way> loadTileData(int x, int y, int z, string key)
        {
            List<Way> lines = new List<Way>();
            int minX = (int)(x * Math.Pow(2, 15 - z));
            int maxX = (int)((x + 1) * Math.Pow(2, 15 - z));
            int minY = (int)(y * Math.Pow(2, 15 - z));
            int maxY = (int)((y + 1) * Math.Pow(2, 15 - z));
            for (int i = minX; i < maxX; i++)
            {
                for (int j = minY; j < maxY; j++)
                {
                    string k = i.ToString() + "_" + j.ToString() + "_15";
                    TileData tiledata;
                    if (this.datacache.TryGetValue(k, out tiledata))
                    {
                        if (z >= 14)
                        {
                            lines.AddRange(tiledata.getData());
                        }
                        else if (z>=12)
                        {
                            List<Way> tilelines = tiledata.getData();
                            for (int w = 0; w < tilelines.Count; w++)
                            {
                                Way tileline = tilelines[w];
                                if (tileline.type != "track" && tileline.type != "service")
                                {
                                    lines.Add(tileline);
                                }
                            }
                        }
                        else if (z>=10)
                        {
                            List<Way> tilelines = tiledata.getData();
                            for (int w = 0; w < tilelines.Count; w++)
                            {
                                Way tileline = tilelines[w];
                                if (tileline.type != "track" && tileline.type != "service" && tileline.type != "residential" && tileline.type != "road" && tileline.type != "living_street")
                                {
                                    lines.Add(tileline);
                                }
                            }
                        }
                        else
                        {
                            List<Way> tilelines = tiledata.getData();
                            for (int w = 0; w < tilelines.Count; w++)
                            {
                                Way tileline = tilelines[w];
                                if (tileline.type != "track" && tileline.type != "service" && tileline.type != "residential" && tileline.type != "road" && tileline.type != "living_street" && tileline.type != "tertiary" && tileline.type != "tertiary_link")
                                {
                                    lines.Add(tileline);
                                }
                            }
                        }
                    }
                }
            }
            return lines;
        }

        [Obsolete]
        private void loadAllData(XElement data)
        {
            foreach (XElement tile in data.Elements())
            {
                string key = tile.Attribute("x").Value + "_" + tile.Attribute("y").Value + "_" + tile.Attribute("z").Value;
                int x = Convert.ToInt32(tile.Attribute("x").Value);
                int y = Convert.ToInt32(tile.Attribute("y").Value);
                int z = Convert.ToInt32(tile.Attribute("z").Value);
                List<Way> lines = new List<Way>();
                foreach (XElement way in tile.Elements())
                {
                    List<PointD> points = new List<PointD>();
                    foreach (XElement nd in way.Elements())
                    {
                        points.Add(new PointD(Convert.ToDouble(nd.Attribute("x").Value), Convert.ToDouble(nd.Attribute("y").Value)));
                    }
                    lines.Add(new Way(points.ToArray(), way.Attribute("type").Value));
                }
                datacache.Add(key, new TileData(lines, x, y, z));
            }
        }

        [Obsolete]
        private XElement readXmlFile(string filename)
        {
            string xmlfile = File.ReadAllText(filename);
            return XDocument.Parse(xmlfile).Element("tiles");
        }
    }
}
