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
using Simple.GeoData;

namespace Simple.Maps.TileMap
{
    /// <summary>
    /// class to get data from datasource (database) using sqlite
    /// </summary>
    class TileDataFactory
    {
        object locker = new object();
        private SqliteConnection conn;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="origin">location of database</param>
        public TileDataFactory(string origin)
        {
            conn = new SqliteConnection("Data Source=data/tiles.db");
            conn.Open();
        }

        /// <summary>
        /// used for closing open database-connection
        /// </summary>
        ~TileDataFactory()
        {
            conn.Close();
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
    }
}
