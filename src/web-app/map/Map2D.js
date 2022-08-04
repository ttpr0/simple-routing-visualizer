import { VectorLayer } from "/map/VectorLayer.js";
import { useGeographic } from "ol/proj"
import { OSM } from "ol/source"
import { Map, View } from "ol";
import { Tile } from "ol/layer";
import { defaults } from "ol/control"

class Map2D 
{
    constructor()
    {
      useGeographic();

      this.baselayer = new Tile({source: new OSM()});

      this.layers = [];

      this.focusfeature = {layer: null, feature: null, changed: false, pos: [0,0]};

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
      return this.layers.find(layer => layer.name == layername);
    }

    addLayer(layer)
    {
      let l = this.layers.find(l => l.name == layer.name);
      if (l)
      {
        this.removeLayer(layer.name);
      }
      this.layers.push(layer);
      this.olmap.addLayer(layer);
    }

    removeLayer(layername)
    {
      this.hideLayer(layername);
      this.layers = this.layers.filter(element => { return element.name != layername; })
    }

    showLayer(layername)
    {
      let layer = this.layers.find(layer => layer.name == layername);
      if (layer)
      {
        this.olmap.addLayer(layer);
      }
    }

    hideLayer(layername)
    {
      let layer = this.layers.find(layer => layer.name == layername);
      if (layer)
      {
        this.olmap.removeLayer(layer);
      }
    }

    toggleLayer(layername)
    {
      let layer = this.layers.find(layer => layer.name == layername);
      if (layer)
      {
        let c = true;
        this.olmap.getLayers().forEach(element => {
          if (element == layer)
          {
            this.olmap.removeLayer(layer);
            c = false; 
          }
        });
        if (c)
        {
          this.olmap.addLayer(layer);
        }
      }
    }

    isVisibile(layername)
    {
      let c = false;
      this.olmap.getLayers().forEach(element => {
        if (element.name === layername)
        {
          c = true; 
        }
      });
      return c;
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