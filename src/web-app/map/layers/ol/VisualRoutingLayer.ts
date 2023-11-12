import { Image } from 'ol/layer';
import { ImageCanvas } from 'ol/source';
import { getMap } from '/map';


const map = getMap();

class VisualRoutingLayer extends Image<ImageCanvas>
{
    extend: number[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    style: string;

    constructor(extend = null, size = null) {
        super({});
        this.style = "rgba(36, 112, 52, 255)";

        if (extend === null) {
            this.extend = map.olmap.getView().calculateExtent(map.olmap.getSize())
        }
        else {
            this.extend = extend;
        }
        if (size === null) {
            size = [4000, 1400];
        }

        this.canvas = document.createElement("canvas");
        this.canvas.height = size[1];
        this.canvas.width = size[0];
        this.ctx = this.canvas.getContext("2d");
        this.ctx.strokeStyle = this.style;
        this.ctx.lineWidth = 2;

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

                const ll = [(this.extend[0] - extent[0]) * sx, (extent[3] - this.extend[1]) * sy]
                const ur = [(this.extend[2] - extent[0]) * sx, (extent[3] - this.extend[3]) * sy]

                let ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, ll[0], ur[1], ur[0] - ll[0], ll[1] - ur[1]);

                return canvas;
            },
            projection: "EPSG:4326",
        });
        this.setSource(source);
    }

    addFeature(feature: any) {
        this.drawFeature(feature.geometry.coordinates);
        this.getSource().changed();
    }
    addFeatures(features: any) {
        for (const feature of features) {
            this.drawFeature(feature.geometry.coordinates);
        }
        this.getSource().changed();
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


export { VisualRoutingLayer }