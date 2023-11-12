import { Image } from 'ol/layer';
import { ImageStatic, ImageCanvas } from 'ol/source';
import { ILayer } from "/map/ILayer";
import { Point } from "ol/geom";
import { RegularShape } from "ol/style";
import { asArray } from 'ol/color';
import { IStyle } from "/map/style/IStyle";
import { RasterStyle } from "/map/style";
import { QuadTree } from './QuadTree';
import { fromLonLat, toLonLat, get as getProjection } from 'ol/proj.js';


class GridLayer implements ILayer {
    ol_layer: Image<ImageCanvas>;
    features: QuadTree;
    extend: number[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    name: any;
    type: string;
    style: RasterStyle;
    proj: any;

    constructor(features, extend, size, name, projection, style = null) {
        if (style === null) {
            this.style = new RasterStyle("first", [255, 125, 0, 255], [0, 125, 255, 255], [100, 300, 600, 1000, 1600, 2400, 3600]);
        }
        else {
            this.style = style;
        }

        this.canvas = document.createElement("canvas");
        this.canvas.height = size[1];
        this.canvas.width = size[0];
        this.ctx = this.canvas.getContext("2d");
        this.extend = extend;
        this.features = new QuadTree();
        this.addFeatures(features);

        this.name = name;
        this.type = "Raster";
        this.proj = getProjection(projection);

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

                const ll = [(this.extend[0] - extent[0]) * sx, (extent[3] - this.extend[1]) * sy]
                const ur = [(this.extend[2] - extent[0]) * sx, (extent[3] - this.extend[3]) * sy]

                let ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, ll[0], ur[1], ur[0] - ll[0], ll[1] - ur[1]);

                return canvas;
            },
            projection: projection,
        });
        this.ol_layer = new Image({ source: source });
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

    getName(): string {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }
    getType(): string {
        return this.type;
    }
    getOlLayer(): Image<ImageCanvas> {
        return this.ol_layer;
    }

    addFeature(feature: any) {
        const [px, py] = this.getPixelFromCoordinates(feature["x"], feature["y"]);
        this.features.insert(px, py, feature["value"]);
        const [r, g, b, a] = this.style.getRGBA(feature["value"]);
        this.drawPixel(px, py, r, g, b, a);
    }
    addFeatures(features: any) {
        for (let feature of features) {
            const [px, py] = this.getPixelFromCoordinates(feature["x"], feature["y"]);
            this.features.insert(px, py, feature["value"]);
        }
        this.setStyle(this.style);
    }
    getFeature(id: number) {
        const [px, py] = this.getPixelFromId(id);
        let value = this.features.get(px, py);
        const [x, y] = this.getCoordinatesFromPixel(px, py);
        const [dx, dy] = this.getGridSize();
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: toLonLat([x + dx / 2, y + dy / 2], this.proj),
            },
            properties: value,
        };
    }
    removeFeature(id: number) {
        const [px, py] = this.getPixelFromId(id);
        this.features.remove(px, py);
        this.drawPixel(px, py, 0, 0, 0, 0);
    }
    getAllFeatures(): number[] {
        let features = []
        for (let feature of this.features.getAllNodes()) {
            const id = this.getIdFromPixel(feature["x"], feature["y"]);
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
        const [px, py] = this.getPixelFromId(id);
        const f = this.features.get(px, py);
        f.value.prop = value;
        const [r, g, b, a] = this.style.getRGBA(value);
        this.drawPixel(px, py, r, g, b, a);
    }
    getProperty(id: number, prop: string): any {
        const [px, py] = this.getPixelFromId(id);
        const f = this.features.get(px, py);
        return f.value.prop;
    }

    setGeometry(id: number, geom: any) { }
    getGeometry(id: number) {
        const [px, py] = this.getPixelFromId(id);
        const [x, y] = this.getCoordinatesFromPixel(px, py);
        const [dx, dy] = this.getGridSize();
        return {
            type: "Point",
            coordinates: toLonLat([x + dx / 2, y + dy / 2], this.proj),
        }
    }

    getFeaturesIntersectingExtend(extend: any): number[] {
        return [];
    }
    getFeaturesInExtend(extend: any): number[] {
        return [];
    }
    getFeaturesAtCoordinate(coord: number[]): number[] {
        const [x, y] = fromLonLat(coord, this.proj);
        const [px, py] = this.getPixelFromCoordinates(x, y);
        let value = this.features.get(px, py);
        if (value === null) {
            return [];
        }
        return [this.getIdFromPixel(px, py)];
    }

    isSelected(id: number): boolean {
        return false
    }
    selectFeature(id: number) { }
    unselectFeature(id: number) { }
    unselectAll() { }
    getSelectedFeatures(): number[] {
        return [];
    }

    getStyle(): IStyle {
        return this.style;
    }
    setStyle(style: IStyle) {
        this.style = style as RasterStyle;
        this.rerender();
    }


    private rerender() {
        const img_data = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        for (const feature of this.features.getAllNodes()) {
            const rgba = this.style.getRGBA(feature.value);
            this.drawRGBA(img_data, feature.x, feature.y, rgba);
        }
        this.ctx.putImageData(img_data, 0, 0);
        if (this.ol_layer !== undefined) {
            this.ol_layer.getSource().changed();
        }
    }

    on(type, listener) {
        this.ol_layer.on(type, listener);
    }

    un(type, listener) {
        this.ol_layer.un(type, listener);
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

    private getCoordinatesFromPixel(px: number, py: number): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        const x = px * width / cols + this.extend[0];
        const y = this.extend[3] - (py + 1) * height / rows;
        return [x, y];
    }

    private getPixelFromId(id: number): [number, number] {
        const cols = this.canvas.width;
        const py = Math.floor(id / cols);
        const px = id % cols;
        return [px, py];
    }

    private getIdFromPixel(px: number, py: number): number {
        const cols = this.canvas.width;
        return py * cols + px
    }

    private getGridSize(): [number, number] {
        const rows = this.canvas.height;
        const cols = this.canvas.width;
        const height = this.extend[3] - this.extend[1];
        const width = this.extend[2] - this.extend[0];
        return [width / cols, height / rows];
    }

    private checkInExtend(x: number, y: number): boolean {
        if (x > this.extend[2] || x < this.extend[0] || y > this.extend[3] || y < this.extend[1]) {
            return false;
        }
        return true;
    }

    private drawPixel(x: number, y: number, r, g, b, a) {
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        this.ctx.clearRect(x, y, 1, 1);
        this.ctx.fillRect(x, y, 1, 1);
    }

    private drawRGBA(img_data: ImageData, x: number, y: number, rgba: number[]) {
        img_data.data[y * (img_data.width * 4) + x * 4 + 0] = rgba[0];
        img_data.data[y * (img_data.width * 4) + x * 4 + 1] = rgba[1];
        img_data.data[y * (img_data.width * 4) + x * 4 + 2] = rgba[2];
        img_data.data[y * (img_data.width * 4) + x * 4 + 3] = rgba[3];
    }
}


export { GridLayer }