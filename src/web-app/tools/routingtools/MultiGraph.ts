import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer'
import { accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, bing_style, targamo_style } from '/map/styles';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util'
import { GeoJSON } from 'ol/format';
import { getMapState } from '/state';
import { ITool } from '/tools/ITool';
import { getMultiGraph, getRouting } from '/routing/api';


const map = getMapState();

class MultiGraph implements ITool
{
    name: string = "MultiGraph";

    param = [
        {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
        {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,3600,100], text:"check?", default: 900},
        {name: "count", title: "Intervalle", info: "Intervalle", type: "range", values: [1,10,1], text:"check?", default: 1}
    ]
    
    out = [
        {name: 'multigraphlayer', type: 'layer'},
    ]

    getParameterInfo(): object[] {
        throw new Error('Method not implemented.');
    }
    getOutputInfo(): object[] {
        throw new Error('Method not implemented.');
    }
  
    async run(param, out, addMessage)
    {
        const layer = map.getLayerByName(param.layer);
        if (layer == null || layer.getType() != "Point")
        {
          throw new Error("pls select a pointlayer!");
        }
        let selectedfeatures = layer.getSelectedFeatures();
        if (selectedfeatures.length > 100 || selectedfeatures.length == 0)
        {
          throw new Error("pls select less then 100 features!");
        }
        var locations = [];
        selectedfeatures.forEach(element => {
          let feature = layer.getFeature(element);
          var location = feature.geometry.coordinates;
          locations.push(location);
        })
        var start = new Date().getTime();
        var geojson = await getMultiGraph(locations, param.range, param.count);
        var end = new Date().getTime();
        addMessage(start - end);
        out.multigraphlayer = new VectorImageLayer(geojson["features"], 'Polygon', 'multigraphlayer');
        (out.multigraphlayer as VectorImageLayer).setStyleFunction(accessibilityStyleFunction);
    }
}

const tool = new MultiGraph();

export { tool }