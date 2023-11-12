import { useGeographic } from "ol/proj"
import { OSM } from "ol/source"
import { Map, View } from "ol";
import { Tile, Layer } from "ol/layer";
import { defaults } from "ol/control";
import { ILayer } from "/map/layers/ILayer";
import { getMapState } from "/state";
import { DragBox } from "ol/interaction";
import { fromLonLat, toLonLat } from 'ol/proj';
import { Deck } from '@deck.gl/core';

const MAP_STATE = getMapState();

class Map3D {
    baselayer;
    layers: ILayer[];
    is_visibile: boolean[];

    olmap: Map;
    ollayers: any[];

    deck: Deck;
    decklayer: Layer;

    dragBox: DragBox = new DragBox();

    constructor() {
        useGeographic();

        this.baselayer = new Tile({ source: new OSM() });

        this.layers = [];
        this.is_visibile = [];

        this.deck = null;
        // Sync deck view with OL view
        this.decklayer = new Layer({
            render: ({ size, viewState }) => {
                if (this.deck === null) {
                    return null;
                }
                const [width, height] = size;
                const [longitude, latitude] = toLonLat(viewState.center);
                const zoom = viewState.zoom - 1;
                const bearing = (-viewState.rotation * 180) / Math.PI;
                const deckViewState = { bearing, longitude, latitude, zoom };
                this.deck.setProps({ width, height, viewState: deckViewState });
                this.deck.redraw();
                return null;
            }
        });

        this.olmap = new Map({
            layers: [this.baselayer, this.decklayer],
            view: new View({
                center: [9.7320104, 52.3758916],
                zoom: 12
            }),
            controls: defaults({
                attribution: false,
                zoom: false,
            }),
        });
        this.ollayers = [];

        this.olmap.on('moveend', () => {
            let view = this.olmap.getView();
            let s = view.getCenter();
            let center = String(s[0]) + "; " + String(s[1])
            let zoom = view.getZoom();
            MAP_STATE.map_position = [center, zoom];
        });

        this.dragBox.on(['boxend'], (e) => {
            for (let i = 0; i < this.layers.length; i++) {
                if (!this.is_visibile[i]) {
                    continue;
                }
                const layer = this.layers[i];
                layer.unselectAll();
                let box = this.dragBox.getGeometry().getExtent();
                let ll = toLonLat([box[0], box[1]]);
                let ur = toLonLat([box[2], box[3]]);
                if (layer.isDeck()) {
                    let ll_p = this.olmap.getPixelFromCoordinate(ll);
                    let ur_p = this.olmap.getPixelFromCoordinate(ur);
                    let picked = this.deck.pickObjects({ x: ll_p[0], y: ur_p[1], width: ur_p[0] - ll_p[0], height: ll_p[1] - ur_p[1], layerIds: [layer.getName()] });
                    for (const { index } of picked) {
                        layer.selectFeature(index);
                    }
                    this.updateDeck();
                } else {
                    box = [ll[0], ll[1], ur[0], ur[1]];
                    const ol_layer = layer.getLayer();
                    let features = [];
                    ol_layer.getSource().forEachFeatureInExtent(box, (feature) => {
                        features.push(feature.getId());
                    })
                    for (let id of features) {
                        layer.selectFeature(id);
                    };
                }
            }
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

    updateDeck() {
        if (this.deck === null) {
            return;
        }
        const layers = [];
        for (let layer of this.layers) {
            if (layer.isDeck()) {
                layers.push(layer.getLayer());
            }
        }
        this.deck.setProps({ layers: layers });
        this.deck.redraw(true);
    }
    private updateLayerState() {
        MAP_STATE.layers = [];
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            MAP_STATE.layers.push({ 'name': layer.getName(), 'type': layer.getType() })
        }
    }

    addLayer(layer: ILayer) {
        let l = this.layers.find(l => l.getName() == layer.getName());
        if (l) {
            this.removeLayer(layer.getName());
        }
        this.layers.push(layer);
        this.is_visibile.push(true);
        if (layer.isDeck()) {
            layer.setMap(this);
            this.updateDeck();
        } else {
            this.olmap.addLayer(layer.getLayer());
        }
        this.updateLayerState();
    }

    removeLayer(layername) {
        let id = this.layers.findIndex(layer => layer.getName() == layername);
        const layer = this.layers[id];
        this.layers.splice(id, 1);
        this.is_visibile.splice(id, 1);
        if (layer.isDeck()) {
            this.updateDeck();
        } else {
            this.olmap.removeLayer(layer.getLayer());
        }
        this.updateLayerState();
    }

    showLayer(layername) {
        let id = this.layers.findIndex(layer => layer.getName() == layername);
        let layer = this.layers[id];
        this.is_visibile[id] = true;
        if (layer.isDeck()) {
            this.updateDeck();
        } else {
            layer.getLayer().setVisibile(true);
        }
    }

    hideLayer(layername) {
        let id = this.layers.findIndex(layer => layer.getName() == layername);
        let layer = this.layers[id];
        this.is_visibile[id] = false;
        if (layer.isDeck()) {
            this.updateDeck();
        } else {
            layer.getLayer().setVisibile(false);
        }
    }

    toggleLayer(layername) {
        let id = this.layers.findIndex(layer => layer.getName() == layername);
        if (this.is_visibile[id]) {
            this.hideLayer(layername);
        } else {
            this.showLayer(layername);
        }
    }

    isVisibile(layername) {
        let id = this.layers.findIndex(layer => layer.getName() == layername);
        return this.is_visibile[id];
    }

    increaseZIndex(layername) {
        const id = this.layers.findIndex(layer => layer.getName() == layername);
        if (id === -1 || id === this.layers.length - 1) {
            return;
        }
        const layer = this.layers[id];
        this.layers[id] = this.layers[id + 1];
        this.layers[id + 1] = layer;

        this.updateDeck();
        this.updateLayerState();
    }

    decreaseZIndex(layername) {
        const id = this.layers.findIndex(layer => layer.getName() == layername);
        if (id === -1 || id === 0) {
            return;
        }
        const layer = this.layers[id];
        this.layers[id] = this.layers[id - 1];
        this.layers[id - 1] = layer;

        this.updateDeck();
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

        const mapregion = document.getElementById(target);
        const canvas = document.createElement('canvas');
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        mapregion.appendChild(canvas);

        this.deck = new Deck({
            initialViewState: { longitude: 0, latitude: 0, zoom: 1 },
            controller: false,
            canvas: canvas,
            style: { pointerEvents: 'none', 'z-index': 1 },
            layers: [],
            layerFilter: ({ layer }) => {
                let id = this.layers.findIndex(l => l.getName() == layer.id);
                if (id == -1) {
                    return true;
                }
                return this.is_visibile[id];
            }
        });

        this.updateDeck();
    }

    forEachFeatureAtPixel(pixel: number[], func: (arg0: ILayer, arg1: number) => void) {
        for (let i = 0; i < this.layers.length; i++) {
            if (!this.is_visibile[i]) {
                continue;
            }
            const layer = this.layers[i];
            if (layer.isDeck()) {
                let picked = this.deck.pickMultipleObjects({ x: pixel[0], y: pixel[1], layerIds: [layer.getName()] });
                for (const { index } of picked) {
                    func(layer, index);
                }
            } else {
                const coord = this.olmap.getCoordinateFromPixel(pixel);
                const ol_layer = layer.getLayer();
                for (let feat of ol_layer.getSource().getFeaturesAtCoordinate(coord)) {
                    func(layer, feat.getId());
                }
            }
        }

        // this.olmap.forEachFeatureAtPixel(pixel, (feature, layer) => {
        //     let l = this.layers.find(element => element.getOlLayer() === layer)
        //     func(l, feature.getId());
        // })
    }

    forEachLayer(func: (arg: ILayer) => void) {
        for (let layer of this.layers) {
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

    activateDragBox() {
        this.addInteraction(this.dragBox);
        MAP_STATE.dragbox_active = true;
    }

    deactivateDragBox() {
        this.removeInteraction(this.dragBox);
        MAP_STATE.dragbox_active = false;
    }

    getOLLayer(name: string): any {
        const item = this.ollayers.find(l => l.name === name);
        if (item === undefined) {
            return undefined;
        }
        return item["layer"];
    }
    addOLLayer(name: string, layer: any) {
        this.removeOLLayer(name);
        layer.setZIndex(10000);
        this.olmap.addLayer(layer);
        this.ollayers.push({ name: name, layer: layer });
    }
    removeOLLayer(name: string) {
        const item = this.ollayers.find(l => l.name === name);
        if (item === undefined) {
            return;
        }
        this.olmap.removeLayer(item["layer"]);
        this.ollayers = this.ollayers.filter(l => l.name !== name);
    }
}

export { Map3D }