package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"

	"github.com/ttpr0/simple-routing-visualizer/src/go-routing/graph"
	"github.com/ttpr0/simple-routing-visualizer/src/go-routing/util"
)

type RoutingRequest struct {
	Start     []float32 `json:"start"`
	End       []float32 `json:"end"`
	Key       int32     `json:"key"`
	Draw      bool      `json:"drawRouting"`
	Alg       string    `json:"algorithm"`
	Stepcount int       `json:"stepount"`
}

type DrawContextRequest struct {
	Start     []float32 `json:"start"`
	End       []float32 `json:"end"`
	Algorithm string    `json:"algorithm"`
}

type DrawRoutingRequest struct {
	Key       int `json:"key"`
	Stepcount int `json:"stepcount"`
}

type DrawContextResponse struct {
	Key int `json:"key"`
}

type RoutingResponse struct {
	Type     string           `json:"type"`
	Finished bool             `json:"finished"`
	Features []GeoJSONFeature `json:"features"`
	Key      int              `json:"key"`
}

func NewRoutingResponse(lines []graph.CoordArray, finished bool, key int) RoutingResponse {
	resp := RoutingResponse{}
	resp.Type = "FeatureCollection"
	resp.Finished = finished
	resp.Key = key
	resp.Features = make([]GeoJSONFeature, 0, 10)
	for _, line := range lines {
		obj := NewGeoJSONFeature()
		obj.Geom["type"] = "LineString"
		iter := line.GetIterator()
		arr := make([][2]float32, 0, 2)
		for {
			coord, ok := iter.Next()
			if !ok {
				break
			}
			arr = append(arr, [2]float32{coord.Lon, coord.Lat})
		}
		obj.Geom["coordinates"] = arr
		obj.Props["value"] = 0
		resp.Features = append(resp.Features, obj)
	}
	return resp
}

func HandleRoutingRequest(w http.ResponseWriter, r *http.Request) {
	data := make([]byte, r.ContentLength)
	r.Body.Read(data)
	req := RoutingRequest{}
	json.Unmarshal(data, &req)
	if req.Draw {
		w.WriteHeader(400)
		return
	}
	start := graph.Coord{Lon: req.Start[0], Lat: req.Start[1]}
	end := graph.Coord{Lon: req.End[0], Lat: req.End[1]}
	var alg graph.IShortestPath
	switch req.Alg {
	case "Dijkstra":
		alg = graph.NewDijkstra(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	case "A*":
		alg = graph.NewAStar(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	case "Bidirect-Dijkstra":
		alg = graph.NewBidirectDijkstra(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	case "Bidirect-A*":
		alg = graph.NewBidirectAStar(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	default:
		alg = graph.NewDijkstra(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	}
	fmt.Println("Using algorithm:", req.Alg)
	fmt.Println("Start Caluclating shortest path between", start, "and", end)
	ok := alg.CalcShortestPath()
	if !ok {
		fmt.Println("routing failed")
		w.WriteHeader(400)
		return
	}
	fmt.Println("shortest path found")
	path := alg.GetShortestPath()
	fmt.Println("start building response")
	resp := NewRoutingResponse(path.GetGeometry(), true, int(req.Key))
	fmt.Println("reponse build")
	data, _ = json.Marshal(resp)
	w.Write(data)
}

var algs_dict util.Dict[int, graph.IShortestPath] = util.NewDict[int, graph.IShortestPath](10)

func HandleCreateContextRequest(w http.ResponseWriter, r *http.Request) {
	// read body
	data := make([]byte, r.ContentLength)
	r.Body.Read(data)
	req := DrawContextRequest{}
	json.Unmarshal(data, &req)

	// process request
	start := graph.Coord{Lon: req.Start[0], Lat: req.Start[1]}
	end := graph.Coord{Lon: req.End[0], Lat: req.End[1]}
	var alg graph.IShortestPath
	switch req.Algorithm {
	case "Dijkstra":
		alg = graph.NewDijkstra(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	case "A*":
		alg = graph.NewAStar(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	case "Bidirect-Dijkstra":
		alg = graph.NewBidirectDijkstra(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	case "Bidirect-A*":
		alg = graph.NewBidirectAStar(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	default:
		alg = graph.NewDijkstra(GRAPH, GetClosestNode(start, GRAPH), GetClosestNode(end, GRAPH))
	}
	key := -1
	for {
		k := rand.Intn(1000)
		if !algs_dict.ContainsKey(k) {
			algs_dict[k] = alg
			key = k
			break
		}
	}
	resp := DrawContextResponse{key}

	// write response
	data, _ = json.Marshal(resp)
	w.Write(data)
}

func HandleRoutingStepRequest(w http.ResponseWriter, r *http.Request) {
	// read body
	data := make([]byte, r.ContentLength)
	r.Body.Read(data)
	req := DrawRoutingRequest{}
	json.Unmarshal(data, &req)

	// process request
	var alg graph.IShortestPath
	if req.Key != -1 && algs_dict.ContainsKey(req.Key) {
		alg = algs_dict[req.Key]
	} else {
		w.WriteHeader(400)
		return
	}

	edges := util.NewList[graph.CoordArray](10)
	finished := !alg.Steps(req.Stepcount, &edges)
	var resp RoutingResponse
	if finished {
		path := alg.GetShortestPath()
		resp = NewRoutingResponse(path.GetGeometry(), true, req.Key)
	} else {
		resp = NewRoutingResponse(edges, finished, req.Key)
	}

	// write response
	data, _ = json.Marshal(resp)
	w.Write(data)
}
