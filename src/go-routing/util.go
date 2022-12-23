package main

import (
	"math"

	"github.com/ttpr0/simple-routing-visualizer/src/go-routing/graph"
)

func GetClosestNode(point graph.Coord, graph graph.IGraph) int32 {
	distance := -1.0
	id := 0
	newdistance := 0.0
	geom := graph.GetGeometry()
	for i := 0; i < len(geom.GetAllNodes()); i++ {
		p := geom.GetNode(int32(i))
		newdistance = math.Sqrt(math.Pow(float64(point.Lat)-float64(p.Lat), 2) + math.Pow(float64(point.Lon)-float64(p.Lon), 2))
		if distance == -1 {
			distance = newdistance
			id = i
		} else if newdistance < distance {
			distance = newdistance
			id = i
		}
	}
	return int32(id)
}

type GeoJSONFeature struct {
	Type  string         `json:"type"`
	Geom  map[string]any `json:"geometry"`
	Props map[string]any `json:"properties"`
}

func NewGeoJSONFeature() GeoJSONFeature {
	line := GeoJSONFeature{}
	line.Type = "Feature"
	line.Geom = make(map[string]any)
	line.Props = make(map[string]any)
	return line
}