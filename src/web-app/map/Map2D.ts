import { VectorLayer } from "/map/VectorLayer";
import { useGeographic } from "ol/proj"
import { OSM } from "ol/source"
import { Map, View } from "ol";
import { Tile } from "ol/layer";
import { defaults } from "ol/control";
import { ILayer } from "/map/ILayer";
import LayerRenderer from "ol/renderer/Layer";
import { getMapState } from "/state";
import { DragBox } from "ol/interaction";
import { toLonLat } from "ol/proj";

const MAP_STATE = getMapState();

class Map2D {
  baselayer;
  layers: ILayer[];
  olmap: Map;
  dragBox: DragBox = new DragBox();

  constructor() {
    useGeographic();

    this.baselayer = new Tile({ source: new OSM() });

    this.layers = [];

    this.olmap = new Map({
      layers: [this.baselayer],
      view: new View({
        center: [9.7320104, 52.3758916],
        zoom: 12
      }),
      controls: defaults({
        attribution: false,
        zoom: false,
      }),
    });

    this.olmap.on('moveend', () => {
      let view = this.olmap.getView();
      let s = view.getCenter();
      let center = String(s[0]) + "; " + String(s[1])
      let zoom = view.getZoom();
      MAP_STATE.map_position = [center, zoom];
    });

    this.dragBox.on(['boxend'], (e) => {
      this.layers.forEach(layer => {
        if (this.isVisibile(layer.getName())) {
          layer.unselectAll();
          var box = this.dragBox.getGeometry().getExtent();
          var ll = toLonLat([box[0], box[1]]);
          var ur = toLonLat([box[2], box[3]]);
          box = [ll[0], ll[1], ur[0], ur[1]];
          for (let id of layer.getFeaturesInExtend(box)) {
            layer.selectFeature(id);
          };
        }
      });
    });
  }

  getLayerByName(layername) {
    return this.layers.find(layer => layer.getName() == layername);
  }
  renameLayer(layername, newname) {
    const layer = this.layers.find(layer => layer.getName() == layername);
    layer.setName(newname);
    this.updateLayerState();
  }

  updateLayerState() {
    MAP_STATE.layers = [];
    let sorted_layers = this.layers.sort((a: ILayer, b: ILayer) => {
      if (a.getZIndex() < b.getZIndex())
        return 1;
      else
        return -1;
    });
    for (let layer of sorted_layers) {
      MAP_STATE.layers.push({ 'name': layer.getName(), 'type': layer.getType() })
    }
  }

  addLayer(layer: ILayer) {
    let l = this.layers.find(l => l.getName() == layer.getName());
    if (l) {
      this.removeLayer(layer.getName());
    }
    layer.setZIndex(100 + this.layers.length);
    this.layers.push(layer);
    this.olmap.addLayer(layer.getOlLayer());
    this.updateLayerState();
  }

  removeLayer(layername) {
    let layer = this.layers.find(layer => layer.getName() == layername);
    this.olmap.removeLayer(layer.getOlLayer());
    this.layers = this.layers.filter(element => {
      if (element.getZIndex() > layer.getZIndex()) {
        element.setZIndex(element.getZIndex() - 1);
      }
      return element.getName() != layername;
    });
    this.updateLayerState();
  }

  showLayer(layername) {
    let layer = this.layers.find(layer => layer.getName() == layername);
    if (layer) {
      layer.setVisibile(true);
    }
  }

  hideLayer(layername) {
    let layer = this.layers.find(layer => layer.getName() == layername);
    if (layer) {
      layer.setVisibile(false);
    }
  }

  toggleLayer(layername) {
    let layer = this.layers.find(layer => layer.getName() == layername);
    if (layer) {
      layer.setVisibile(!layer.getVisibile());
    }
  }

  isVisibile(layername) {
    let layer = this.layers.find(layer => layer.getName() == layername);
    return layer.getVisibile();
  }

  increaseZIndex(layername) {
    const layer = this.layers.find(layer => layer.getName() == layername);
    if (layer.getZIndex() === 99 + this.layers.length) {
      return;
    }
    this.layers.forEach(element => {
      if (element.getZIndex() === layer.getZIndex() + 1) {
        element.setZIndex(layer.getZIndex());
      }
    });
    layer.setZIndex(layer.getZIndex() + 1);
    this.updateLayerState();
  }

  decreaseZIndex(layername) {
    const layer = this.layers.find(layer => layer.getName() == layername);
    if (layer.getZIndex() === 100) {
      return;
    }
    this.layers.forEach(element => {
      if (element.getZIndex() === layer.getZIndex() - 1) {
        element.setZIndex(layer.getZIndex());
      }
    });
    layer.setZIndex(layer.getZIndex() - 1);
    this.updateLayerState();
  }

  addInteraction(interaction) {
    this.olmap.addInteraction(interaction);
  }

  removeInteraction(interaction) {
    this.olmap.removeInteraction(interaction);
  }

  on(type, listener) {
    this.olmap.on(type, listener);
  }

  un(type, listener) {
    this.olmap.un(type, listener);
  }

  setTarget(target: string) {
    this.olmap.setTarget(target);
  }

  forEachFeatureAtPixel(pixel: number[], func: (ILayer, number) => void) {
    const coord = this.olmap.getCoordinateFromPixel(pixel);
    for (const layer of this.layers) {
      if (!layer.getVisibile()) {
        continue;
      }
      const features = layer.getFeaturesAtCoordinate(coord);
      for (const feature of features) {
        func(layer, feature);
      }
    }

    this.olmap.forEachFeatureAtPixel(pixel, (feature, layer) => {
      let l = this.layers.find(element => element.getOlLayer() === layer)
      func(l, feature.getId());
    })
  }

  forEachLayer(func)
  {
      for (let layer of this.layers)
      {
          func(layer);
      }
  }

  addOverlay(overlay) {
    this.olmap.addOverlay(overlay);
  }

  removeOverlay(overlay) {
    this.olmap.removeOverlay(overlay);
  }

  getCoordinateFromPixel(pixel) {
    return this.olmap.getCoordinateFromPixel(pixel);
  }
  getEventCoordinate(e) {
    return this.olmap.getEventCoordinate(e);
  }

  activateDragBox()
  {
      this.addInteraction(this.dragBox);
      MAP_STATE.dragbox_active = true;
  }

  deactivateDragBox()
  {
      this.removeInteraction(this.dragBox);
      MAP_STATE.dragbox_active = false;
  }
}

export { Map2D }