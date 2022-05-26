import { VectorLayer } from "/map/VectorLayer.js";


class Map2D 
{
    constructor()
    {
      ol.proj.useGeographic();

      this.baselayer = new ol.layer.Tile({source: new ol.source.OSM()});

      this.vectorlayers = [];

      this.focusfeature = {layer: null, feature: null, changed: false, pos: [0,0]};

      this.olmap = new ol.Map({
        layers: [this.baselayer],
        view: new ol.View({
          center: [9.7320104,52.3758916],
          zoom: 12
        })
      });
    }

    getVectorLayerByName(name)
    {
      return this.vectorlayers.find(layer => layer.name == name);
    }

    addVectorLayer(layer)
    {
      layer.setMap(this);
      this.vectorlayers.push(layer);
      if (layer.display)
      {
        this.showLayer(layer);
      }
    }

    removeVectorLayer(layer)
    {
      this.hideLayer(layer);
      this.vectorlayers = this.vectorlayers.filter(element => { return element != layer; })
    }

    showLayer(layer)
    {
      this.olmap.addLayer(layer);
    }

    hideLayer(layer)
    {
      this.olmap.removeLayer(layer);
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