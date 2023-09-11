import { Image as ImageLayer } from 'ol/layer';
import { ImageStatic, ImageCanvas } from 'ol/source';
import { ILayer } from "/map/ILayer";
import { IStyle } from "/map/style/IStyle";
import { RasterStyle } from "/map/style";
import { QuadTree } from './QuadTree';
import { fromLonLat, toLonLat, get as getProjection } from 'ol/proj.js';


class RemoteGridLayer implements ILayer {
    ol_layer: ImageLayer<ImageCanvas>;
    extend: number[];
    canvas: HTMLCanvasElement;

    url: string;
    id: string;

    name: any;
    type: string;
    style: RasterStyle;
    cell_size: number;
    proj: any;

    constructor(url, id, name, projection, style = null) {
        if (style === null) {
            this.style = new RasterStyle("first", [255, 125, 0, 255], [0, 125, 255, 255], [100, 300, 600, 1000, 1600, 2400, 3600]);
        }
        else {
            this.style = style;
        }
        this.cell_size = 0;
        this.url = url;
        this.id = id;

        this.name = name;
        this.type = "Raster";
        this.proj = getProjection(projection);

        this.canvas = null;
        this.extend = [0, 0, 0, 0];

        const source = new ImageCanvas({
            canvasFunction: (extent, resolution, pixel_ratio, size, projection) => {
                if (resolution > 150 && this.cell_size !== 1000) {
                    this.cell_size = 1000;
                    this.setStyle(this.style);
                } else if (resolution <= 150 && resolution > 50 && this.cell_size !== 500) {
                    this.cell_size = 500;
                    this.setStyle(this.style);
                } else if (resolution <= 50 && this.cell_size !== 100) {
                    this.cell_size = 100;
                    this.setStyle(this.style);
                }
                if (this.canvas === null) {
                    return;
                }

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
        this.ol_layer = new ImageLayer({
            source: source,
        });
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
    getOlLayer(): ImageLayer<ImageCanvas> {
        return this.ol_layer;
    }

    addFeature(feature: any) {
        throw Error("not implemented");
    }
    addFeatures(features: any) {
        throw Error("not implemented");
    }
    getFeature(id: number) {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [0, 0],
            },
            properties: {
                value: 0,
            },
        };
    }
    removeFeature(id: number) {
        throw Error("not implemented");
    }
    getAllFeatures(): number[] {
        throw Error("not implemented");
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
        throw Error("not implemented");
    }
    getProperty(id: number, prop: string): any {
        throw Error("not implemented");
    }

    setGeometry(id: number, geom: any) { }
    getGeometry(id: number) {
        return {
            type: "Point",
            coordinates: [0, 0],
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
        return [0];
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
        this.canvas = null;
        this.style = style as RasterStyle;
        const promise = this.getPNG(this.style, this.cell_size);
        promise.then(value => {
            let [img, extent] = value;
            this.extend = extent;
            this.canvas = img;
            if (this.ol_layer !== undefined) {
                this.ol_layer.getSource().changed();
            }
        })
    }

    on(type, listener) {
        this.ol_layer.on(type, listener);
    }

    un(type, listener) {
        this.ol_layer.un(type, listener);
    }

    private async getPNG(style: RasterStyle, cell_size: number): Promise<any> {
        const url = this.url + "/v0/grid_png";
        const request = {
            id: this.id,
            value: this.style.attribute,
            cell_size: cell_size,
            style: {
                ranges: style.ranges,
                colors: style.colors,
                no_data: style.no_data,
                no_data_color: style.no_data_color
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(request)
        });
        const data = await response.json();

        let canvas = document.createElement('canvas');
        canvas.width = data["size"][0];
        canvas.height = data["size"][1];
        let ctx = canvas.getContext("2d");
        var image = new Image();
        image.src = data["img"];
        await image.decode();
        ctx.drawImage(image, 0, 0);
        return [canvas, data["extent"]];
    }
}


export { RemoteGridLayer }