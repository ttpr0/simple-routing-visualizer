using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    enum RoadType : sbyte
    {
        motorway = 1,
        motorway_link = 2,
        trunk = 3,
        trunk_link = 4,
        primary = 5,
        primary_link = 6,
        secondary = 7,
        secondary_link = 8,
        tertiary = 9,
        tertiary_link = 10,
        residential = 11,
        living_street = 12,
        unclassified = 13,
        road = 14,
        track = 15,
    }

    [Flags]
    enum Access
    {
        privat,
        
    }

    [Flags]
    enum Restrictions
    {
        none = 0,
        forward = 1,
        backward = 2,
        both = 4,
        noovertacking = 8,
        giveway = 16,
        stop = 32,
        narrow = 64,
    }

    enum Obstacles
    {
        hump,
        bump,
        table,
        cushion,
        dip,
        chicane,
        island,
        choker,
        crossing,
        trafficsignal,
    }

    enum Direction : byte
    {
        backward = 0,
        forward = 1,
    }
}
