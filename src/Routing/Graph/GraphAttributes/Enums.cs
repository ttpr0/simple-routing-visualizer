using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    enum RoadType
    {
        motorway = 0,
        trunk = 1,
        primary = 2,
        secondary = 3,
        tertiary = 4,
        residential = 5,
        unclassified = 6,
        motorway_link = 7,
        trunk_link = 8,
        primary_link = 9,
        secondary_link = 10,
        tertiary_link = 11,
        service = 12,
        living_street = 13,
        track = 14,
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
}
