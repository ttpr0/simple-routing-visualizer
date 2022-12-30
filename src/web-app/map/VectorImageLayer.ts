import { defaultStyle, defaultHighlightStyle } from "./styles";
import { VectorImage } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source'
import { ILayer } from "/map/ILayer";
import { GeoJSON } from "ol/format";
import { Point } from "ol/geom";
import { RegularShape } from "ol/style";
import { asArray } from 'ol/color';
import { Image } from "ol";
import { IStyle } from "/map/style/IStyle";
import { PointStyle, LineStyle, PolygonStyle } from "/map/style";


class VectorImageLayer implements ILayer
{
    ol_layer: VectorImage<VectorSource>;
    format: GeoJSON;
    count: number = 0;

    name: any;
    type: string;
    selected_features: number[];
    style: IStyle;

    constructor(features, type, name, style = null)
    {
        this.format = new GeoJSON();

        features = features.filter(element => { return element.geometry.type === "Multi" + type || element.geometry.type === type; });
        let ol_feat = this.format.readFeatures({type: "FeatureCollection", features: features});
        ol_feat.forEach((element) => {
            element.setId(this.count);
            this.count += 1;
        })
        var source = new VectorSource({
            features: ol_feat,
        });
        this.ol_layer = new VectorImage({source: source});

        this.name = name;
        this.type = type;
        this.selected_features = [];

        if (style === null) {
            switch (this.type) {
                case "Point":
                    this.style = new PointStyle();
                    break;
                case "LineString":
                    this.style = new LineStyle();
                    break;
                default:
                    this.style = new PolygonStyle();
            }
        }
        else {
            this.style = style;
        }
        this.setStyle(this.style);
    }
    
    getVisibile(): boolean {
        return this.ol_layer.getVisible();
    }
    setVisibile(visibile: boolean) {
       this.ol_layer.setVisible(visibile);
    }
    getZIndex(): number {
        return this.ol_layer.getZIndex();
    }
    setZIndex(z_index: number) {
        this.ol_layer.setZIndex(z_index);
    }

    getName() : string {
        return this.name;
    }
    getType() : string {
        return this.type;
    }
    getOlLayer(): VectorImage<VectorSource> {
        return this.ol_layer;
    }

    addFeature(feature: any) {
        if (feature.geometry.type === "Multi" + this.type || feature.geometry.type === this.type)
        {
            let f = this.format.readFeature(feature);
            f.setId(this.count);
            this.count += 1;
            this.ol_layer.getSource().addFeature(f);
        }
    }
    addFeatures(features: any) {
        features = features.filter(element => { return element.geometry.type === "Multi" + this.type || element.geometry.type === this.type; });
        let ol_feat = this.format.readFeatures({type: "FeatureCollection", features: features});
        for (let f of ol_feat) {
            f.setId(this.count);
            this.count += 1;
        }
        this.ol_layer.getSource().addFeatures(ol_feat);
    }
    getFeature(id: number) {
        let f = this.ol_layer.getSource().getFeatureById(id);
        return JSON.parse(this.format.writeFeature(f));
    }
    removeFeature(id: number) {
        let f = this.ol_layer.getSource().getFeatureById(id);
        this.ol_layer.getSource().removeFeature(f);
    }
    getAllFeatures(): number[] {
        let features = []
        this.ol_layer.getSource().forEachFeature((element) => {
            features.push(element.getId());
        })
        return features;
    }

    getAttributes(): [string, string][] {
        throw new Error("Method not implemented.");
    }
    addAttribute(name: string, dtype: string) {
        throw new Error("Method not implemented.");
    }
    removeAttribute(name: string) {
        throw new Error("Method not implemented.");
    }

    setProperty(id: number, prop: string, value: any) {
        let f = this.ol_layer.getSource().getFeatureById(id);
        f.set(prop, value);
    }
    getProperty(id: number, prop: string) : any {
        let f = this.ol_layer.getSource().getFeatureById(id);
        return f.get(prop);
    }

    setGeometry(id: number, geom: any) {
        if (geom.type  === this.type || geom.type === "Multi" + this.type)
        {
            let f = this.ol_layer.getSource().getFeatureById(id);
            (f.getGeometry() as Point).setCoordinates(geom.coordinates);
        }
    }
    getGeometry(id: number) {
        let f = this.ol_layer.getSource().getFeatureById(id);
        let geom = f.getGeometry() as Point;
        return {
            type: geom.getType(),
            coordinates: geom.getCoordinates(),
        }
    }

    getFeaturesIntersectingExtend(extend: any): number[] {
        let features = [];
        this.ol_layer.getSource().forEachFeatureIntersectingExtent(extend, (feature) => {
            features.push(feature.getId());
        })
        return features;
    }
    getFeaturesInExtend(extend: any): number[] {
        let features = [];
        this.ol_layer.getSource().forEachFeatureInExtent(extend, (feature) => {
            features.push(feature.getId());
        })
        return features;
    }
    getFeaturesAtCoordinate(coord: number[]): number[] {
        let features = [];
        for (let feat of this.ol_layer.getSource().getFeaturesAtCoordinate(coord))
        {
            features.push(feat.getId());
        }
        return features;
    }

    isSelected(id: number) : boolean
    {
        return this.selected_features.includes(id);
    }
    selectFeature(id: number)
    {
        if (!this.selected_features.includes(id))
        {
            let f = this.ol_layer.getSource().getFeatureById(id);
            f.set("selected", true);
            this.selected_features.push(id);
        }
    }
    unselectFeature(id: number)
    {
        let f = this.ol_layer.getSource().getFeatureById(id);
        f.set("selected", false);
        this.selected_features = this.selected_features.filter(element => { return element != id; })
    }
    unselectAll()
    {
        this.ol_layer.getSource().forEachFeature((feature) => {
            feature.set("selected", false);
        })
        this.selected_features = [];
    }
    getSelectedFeatures(): number[] {
        return this.selected_features;
    }

    setStyle(style: IStyle) {
        this.style = style;
        this.ol_layer.setStyle((feature, resolution) => {
            if (feature.get('selected'))
            {
                return this.style.getHighlightStyle(feature, resolution);
            }
            else
            {
                return this.style.getStyle(feature, resolution);
            }
        });
    }

    on(type, listener)
    {
      this.ol_layer.on(type, listener);
    }

    un(type, listener)
    {
      this.ol_layer.un(type, listener);
    }
}

export {VectorImageLayer}