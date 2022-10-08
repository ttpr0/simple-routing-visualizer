import { VectorLayer } from "/map/VectorLayer";
import { useGeographic } from "ol/proj"
import { OSM } from "ol/source"
import { Map, View } from "ol";
import { Tile } from "ol/layer";
import { defaults } from "ol/control";
import { ILayer } from "/map/ILayer";
import LayerRenderer from "ol/renderer/Layer";

class Map2D 
{
    baselayer;
    layers: ILayer[];
    olmap: Map;

    constructor()
    {
      useGeographic();

      this.baselayer = new Tile({source: new OSM()});

      this.layers = [];

      this.olmap = new Map({
        layers: [this.baselayer],
        view: new View({
          center: [9.7320104,52.3758916],
          zoom: 12
        }),
        controls : defaults({
          attribution : false,
          zoom : false,
        }),
      });
    }

    getLayerByName(layername)
    {
      return this.layers.find(layer => layer.getName() == layername);
    }

    addLayer(layer: ILayer)
    {
      let l = this.layers.find(l => l.getName() == layer.getName());
      if (l) {
        this.removeLayer(layer.getName());
      }
      this.layers.push(layer);
      this.olmap.addLayer(layer.getOlLayer());
    }

    removeLayer(layername)
    {
      let layer = this.layers.find(layer => layer.getName() == layername);
      this.olmap.removeLayer(layer.getOlLayer());
      this.layers = this.layers.filter(element => { return element.getName() != layername; })
    }

    showLayer(layername)
    {
      let layer = this.layers.find(layer => layer.getName() == layername);
      if (layer)
      {
        layer.setVisibile(true);
      }
    }

    hideLayer(layername)
    {
      let layer = this.layers.find(layer => layer.getName() == layername);
      if (layer)
      {
        layer.setVisibile(false);
      }
    }

    toggleLayer(layername)
    {
      let layer = this.layers.find(layer => layer.getName() == layername);
      if (layer)
      {
        layer.setVisibile(!layer.getVisibile());
      }
    }

    isVisibile(layername)
    {
      let layer = this.layers.find(layer => layer.getName() == layername);
      return layer.getVisibile();
    }

    addInteraction(interaction)
    {
      this.olmap.addInteraction(interaction);
    }

    removeInteraction(interaction)
    {
      this.olmap.removeInteraction(interaction);
    }

    on(type, listener)
    {
      this.olmap.on(type, listener);
    }

    un(type, listener)
    {
      this.olmap.un(type, listener);
    }
}

export { Map2D }