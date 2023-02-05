import { Image } from 'ol/layer';
import { ImageCanvas } from 'ol/source';
import { ILayer } from "/map/ILayer";
import { Point } from "ol/geom";
import { RegularShape } from "ol/style";
import { asArray } from 'ol/color';
import { IStyle } from "/map/style/IStyle";
import { getMap } from '/map';


const map = getMap();

class VisualRoutingLayer implements ILayer
{
    ol_layer: Image<ImageCanvas>;
    extend: number[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    name: any;
    type: string;
    style: string;

    constructor(extend = null, size = null, name)
    {
        this.style = "rgba(36, 112, 52, 255)";

        if (extend === null) {
            this.extend = map.olmap.getView().calculateExtent(map.olmap.getSize())
        }
        else {
            this.extend = extend;
        }
        if (size === null) {
            size = [4000,1400];
        }

        this.canvas = document.createElement("canvas");
        this.canvas.height = size[1];
        this.canvas.width = size[0];
        this.ctx = this.canvas.getContext("2d");
        this.ctx.strokeStyle = this.style;
        this.ctx.lineWidth = 2;

        this.name = name;
        this.type = "Custom";

        let source = new ImageCanvas({
            canvasFunction: (extent, resolution, pixel_ratio, size, projection) => {
                console.log(extent, projection);
                let canvas = document.createElement('canvas');
                canvas.width = size[0];
                canvas.height = size[1];

                const dx = extent[2] - extent[0];
                const dy = extent[3] - extent[1];
                const sx = size[0] / dx;
                const sy = size[1] / dy;

                const ll = [(this.extend[0] - extent[0])*sx, (extent[3] - this.extend[1])*sy]
                const ur = [(this.extend[2] - extent[0])*sx, (extent[3] - this.extend[3])*sy]

                let ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, ll[0], ur[1], ur[0]-ll[0], ll[1]-ur[1]);

                return canvas;
            },
            projection: "EPSG:4326",
        });
        this.ol_layer = new Image({source: source}); 
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
    setName(name: string) {
        this.name = name;
    }
    getType() : string {
        return this.type;
    }
    getOlLayer(): Image<ImageCanvas> {
        return this.ol_layer;
    }

    addFeature(feature: any) {
        this.drawFeature(feature.geometry.coordinates);
        this.ol_layer.getSource().changed();
    }
    addFeatures(features: any) {
        for (const feature of features) {
            this.drawFeature(feature.geometry.coordinates);
        }
        this.ol_layer.getSource().changed();
    }
    getFeature(id: number) {
        return null;
    }
    removeFeature(id: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getAllFeatures(): number[] {
        return [];
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
    }
    getProperty(id: number, prop: string) : any {
        return null;
    }

    setGeometry(id: number, geom: any) {}
    getGeometry(id: number) {
        return null;
    }

    getFeaturesIntersectingExtend(extend: any): number[] {
        return [];
    }
    getFeaturesInExtend(extend: any): number[] {
        return [];
    }
    getFeaturesAtCoordinate(coord: number[]): number[] {
        return [];
    }

    isSelected(id: number) : boolean {
        return false
    }
    selectFeature(id: number) {}
    unselectFeature(id: number) {}
    unselectAll() {}
    getSelectedFeatures(): number[] {
        return [];
    }

    getStyle() : IStyle {
        return null;
    }
    setStyle(style: IStyle) {}

    on(type, listener)
    {
      this.ol_layer.on(type, listener);
    }

    un(type, listener)
    {
      this.ol_layer.un(type, listener);
    }

    private getPixelFromCoordinates(x: number, y: number): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        const col = Math.round((x - this.extend[0]) / width * cols);
        const row = Math.round((this.extend[3] - y) / height * rows);
        return [col, row];
    }

    private drawFeature(coords: number[][]) {
        this.ctx.beginPath();
        this.ctx.moveTo(...this.getPixelFromCoordinates(coords[0][0], coords[0][1]));
        for (let i = 1; i < coords.length; i++) {
            this.ctx.lineTo(...this.getPixelFromCoordinates(coords[i][0], coords[i][1]));
        }
        this.ctx.stroke();
    }
}


export {VisualRoutingLayer}