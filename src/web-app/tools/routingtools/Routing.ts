import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer'
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util'
import { GeoJSON } from 'ol/format';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';
import { getMultiGraph, getRouting } from '/routing/api';
import { LineStyle } from '/map/style';


const map = getMap();

class Routing implements ITool
{
    name: string = "Routing";
    param = [
        {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
        {name: "draw", title: "Draw Routing", info: "", type: "check", values: [], text:"draw?" },
        {name: "routingtype", title: "Routing Algorithm", info: "", type: "select", values: ['Dijktra', 'A*', 'Bidirect-Dijkstra', 'Bidirect-A*'], text:"Routing-Alg"}
    ]
    out = [
    ]

    getToolName(): string {
        return this.name;
    }
    getParameterInfo(): object[] {
        return this.param;
    }
    getOutputInfo(): object[] {
        return this.out;
    }
    getDefaultParameters(): object {
        return { draw: false, routingtype: "Djkstra" };
    }
  
    async run(param, out, addMessage)
    {
        const layer = map.getLayerByName(param.layer);
        if (layer == null || layer.getType() != "Point")
        {
          throw new Error("pls select a pointlayer!");
        }
        let selectedfeatures = layer.getSelectedFeatures();
        if (selectedfeatures.length != 2)
        {
          throw new Error("pls mark two features!");
        }
        let feature = layer.getFeature(selectedfeatures[0]);
        let startpoint = feature.geometry.coordinates;
        feature = layer.getFeature(selectedfeatures[1]);
        let endpoint = feature.geometry.coordinates;

        if (param.draw) 
        {
            var key = -1;
            var finished = false;
            var geojson = null;
            let routinglayer = new VectorLayer([], 'LineString', "routinglayer");
            routinglayer.setStyle(new LineStyle('green', 2));
            map.addLayer(routinglayer);
            var start = new Date().getTime();
            do
            {
                geojson = await getRouting(startpoint, endpoint, key, true, 1000, param.routingtype);
                key = geojson.key;
                finished = geojson.finished;
                for (let feature of geojson["features"]) {
                    routinglayer.addFeature(feature);
                }
            } while (!geojson.finished)
            var end = new Date().getTime();
            addMessage(end - start);
            routinglayer = new VectorLayer(geojson["features"], 'LineString', 'routinglayer');
            routinglayer.setStyle(new LineStyle('#ffcc33', 10));
            map.addLayer(routinglayer);
        }
        else 
        {
            var key = -1;
            var start = new Date().getTime();
            var geojson = await getRouting(startpoint, endpoint, key, false, 1, param.routingtype);
            var end = new Date().getTime();
            addMessage(end - start);
            let routinglayer = new VectorLayer(geojson["features"], 'LineString', 'routinglayer');
            routinglayer.setStyle(new LineStyle('#ffcc33', 10));
            map.addLayer(routinglayer);
        }
    }
}

const tool = new Routing();

export { tool }