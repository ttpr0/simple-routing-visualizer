import { Image } from 'ol/layer';
import { ImageStatic, ImageCanvas } from 'ol/source';
import { ILayer } from "/map/ILayer";
import { Point } from "ol/geom";
import { RegularShape } from "ol/style";
import { asArray } from 'ol/color';
import { IStyle } from "/map/style/IStyle";
import { RasterStyle } from "/map/style";
import { QuadTree } from './QuadTree';


class GridLayer implements ILayer
{
    ol_layer: Image<ImageCanvas>;
    features: QuadTree;
    extend: number[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    name: any;
    type: string;
    style: RasterStyle;

    constructor(features, extend, size, name, style = null)
    {
        if (style === null) {
            this.style = new RasterStyle("value", [255,125,0,255], [0,125,255,255], [100, 300, 600, 1000, 1600, 2400, 3600]);
        }
        else {
            this.style = style;
        }

        this.canvas = document.createElement("canvas");
        this.canvas.height = size[1];
        this.canvas.width = size[0];
        this.ctx = this.canvas.getContext("2d");
        this.extend = extend;
        this.features = new QuadTree;
        this.addFeatures(features);

        this.name = name;
        this.type = "Raster";

        this.setStyle(this.style);

        let source = new ImageCanvas({
            canvasFunction: (extent, resolution, pixel_ratio, size, projection) => {
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
        const [x, y] = this.rasterizeCoordinates(feature["x"], feature["y"]);
        this.features.insert(x, y, feature["value"]);
        const [r, g, b, a] = this.style.getRGBA(feature["value"]);
        const [px, py] = this.getPixelFromCoordinates(x, y);
        this.drawPixel(px, py, r, g, b, a);
    }
    addFeatures(features: any) {
        for (let feature of features) {
            const [x, y] = this.rasterizeCoordinates(feature["x"], feature["y"]);
            this.features.insert(x, y, feature["value"]);
        }
        this.setStyle(this.style);
    }
    getFeature(id: number) {
        const [x, y] = this.getCoordinatesFromId(id);
        let value = this.features.get(x, y);
        const [dx, dy] = this.getGridSize();
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [x+dx/2, y+dy/2]
            },
            properties: value,
        };
    }
    removeFeature(id: number) {
        const [x, y] = this.getCoordinatesFromId(id);
        this.features.remove(x, y);
        const [px, py] = this.getPixelFromId(id);
        this.drawPixel(px, py, 0, 0, 0, 0);
    }
    getAllFeatures(): number[] {
        let features = []
        for (let feature of this.features.getAllNodes()) {
            const id = this.getIdFromCoordinates(feature["x"], feature["y"]);
            features.push(id);
        }
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
        const [x, y] = this.getCoordinatesFromId(id);
        const f = this.features.get(x, y);
        f.value.prop = value;
        const [r, g, b, a] = this.style.getRGBA(value);
        const [px, py] = this.getPixelFromId(id);
        this.drawPixel(px, py, r, g, b, a);
    }
    getProperty(id: number, prop: string) : any {
        const [x, y] = this.getCoordinatesFromId(id);
        const f = this.features.get(x, y);
        return f.value.prop;
    }

    setGeometry(id: number, geom: any) {}
    getGeometry(id: number) {
        const [x, y] = this.getCoordinatesFromId(id);
        const [dx, dy] = this.getGridSize();
        return {
            type: "Point",
            coordinates: [x+dx/2, y+dy/2],
        }
    }

    getFeaturesIntersectingExtend(extend: any): number[] {
        return [];
    }
    getFeaturesInExtend(extend: any): number[] {
        return [];
    }
    getFeaturesAtCoordinate(coord: number[]): number[] {
        const [x, y] = this.rasterizeCoordinates(coord[0], coord[1]);
        let value = this.features.get(x, y);
        if (value === null) {
            return [];
        }
        return [this.getIdFromCoordinates(coord[0], coord[1])];
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
        return this.style;
    }
    setStyle(style: IStyle) {
        this.style = style as RasterStyle;
        for (let feature of this.features.getAllNodes()) {
            const [r, g, b, a] = this.style.getRGBA(feature["value"]);
            const [px, py] = this.getPixelFromCoordinates(feature["x"], feature["y"]);
            this.drawPixel(px, py, r, g, b, a);
        }
    }

    on(type, listener)
    {
      this.ol_layer.on(type, listener);
    }

    un(type, listener)
    {
      this.ol_layer.un(type, listener);
    }

    private rasterizeCoordinates(x: number, y: number): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        const dx = width / cols;
        const dy = height / rows;
        const nx = dx * Math.floor(x / dx);
        const ny = dy * Math.floor(y / dy);
        return [nx, ny];
    }

    private getIdFromCoordinates(x: number, y: number): number {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        const col = Math.floor((x - this.extend[0]) / width * cols);
        const row = rows - Math.floor((y - this.extend[1]) / height * rows);
        return row*cols + col;
    }

    private getCoordinatesFromId(id: number): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const row = Math.floor(id / cols);
        const col = id % cols;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        const x = col * width/cols + this.extend[0];
        const y = this.extend[3] - row * height/rows;
        return [x, y];
    }

    private getPixelFromCoordinates(x: number, y: number): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        const col = Math.floor((x - this.extend[0]) / width * cols);
        const row = Math.floor((this.extend[3] - y) / height * rows);
        return [col, row];
    }

    private getPixelFromId(id: number): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const row = Math.floor(id / cols);
        const col = id % cols;
        return [row, col];
    }

    private getGridSize(): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        return [width/cols, height/rows];
    }

    private drawPixel(x: number, y: number, r, g, b, a) {
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a}`;
        this.ctx.fillRect(x, y, 1, 1);
    }

    private drawPixels(pixels: number[][], r, g, b, a) {
        const imgdata = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imgdata.data;
        for (let [x, y] of pixels) {
            const index = 4 * (x * this.canvas.width + y);
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
        }
        this.ctx.putImageData(imgdata, 0, 0);
    }
}


export {GridLayer}