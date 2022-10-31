import { NPageHeader } from "naive-ui";
import { DragBox } from "ol/interaction";
import { toLonLat } from "ol/proj";
import { Map2D } from "/map/Map2D";

const MAP: Map2D = new Map2D();

const dragBox = new DragBox();
dragBox.on(['boxend'], function(e) {
    MAP.layers.forEach(layer => {
        if (MAP.isVisibile(layer.getName()))
        {
            layer.unselectAll();
            var box = dragBox.getGeometry().getExtent();
            var ll = toLonLat([box[0], box[1]]);
            var ur = toLonLat([box[2], box[3]]);
            box = [ll[0], ll[1], ur[0], ur[1]];
            for (let id of layer.getFeaturesInExtend(box)) {
              layer.selectFeature(id);
            };
        }
    });
});

class MapState
{
    layers: any[] = [];
    dragbox_active: boolean = false;
    map_position = ["", 0];
    focuslayer = null;

    constructor()
    {}

    setup()
    {
        MAP.on('moveend', () => {
            let view = MAP.olmap.getView();
            let s = view.getCenter();
            let center = String(s[0])+ "; " + String(s[1])
            let zoom = view.getZoom();
            this.map_position = [center, zoom];
        })
    }

    addLayer(layer: any)
    {
        MAP.addLayer(layer);
        this.updateLayers();
    }

    removeLayer(layer: any)
    {
        MAP.removeLayer(layer);
        this.updateLayers();
    }

    updateLayers()
    {
        this.layers = [];
        for (let layer of MAP.layers)
        {
            this.layers.push({'name': layer.getName(), 'type': layer.getType()})
        }
    }

    addInteraction(interaction: any)
    {
        MAP.addInteraction(interaction);
    }

    removeInteraction(interaction: any)
    {
        MAP.removeInteraction(interaction);
    }

    getLayerByName(layername)
    {
        return MAP.getLayerByName(layername);
    }

    showLayer(layername)
    {
        MAP.showLayer(layername);
    }

    hideLayer(layername)
    {
        MAP.hideLayer(layername);
    }

    toggleLayer(layername)
    {
        MAP.toggleLayer(layername);
    }

    isVisibile(layername)
    {
        return MAP.isVisibile(layername);
    }

    on(type, listener)
    {
      MAP.on(type, listener);
    }

    un(type, listener)
    {
      MAP.un(type, listener);
    }

    setTarget(target: string)
    {
        MAP.olmap.setTarget(target);
    }

    forEachFeatureAtPixel(pixel: number[], func: (ILayer, number) => void)
    {
        MAP.olmap.forEachFeatureAtPixel(pixel, (feature, layer) => {
            let l = MAP.layers.find(element => element.getOlLayer() === layer)
            func(l, feature.getId());
        })
    }

    activateDragBox()
    {
        MAP.addInteraction(dragBox);
        this.dragbox_active = true;
    }

    deactivateDragBox()
    {
        MAP.removeInteraction(dragBox);
        this.dragbox_active = false;
    }

    forEachLayer(func)
    {
        for (let layer of MAP.layers)
        {
            func(layer);
        }
    }

    addOverlay(overlay) 
    {
        MAP.olmap.addOverlay(overlay);
    }

    removeOverlay(overlay)
    {
        MAP.olmap.removeOverlay(overlay);
    }

    getCoordinateFromPixel(pixel)
    {
        return MAP.olmap.getCoordinateFromPixel(pixel);
    }
}

export { MapState }