import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { IStyle } from "./IStyle";

class RasterStyle implements IStyle
{
    attribute: string;
    start_color: any;
    end_color: any;
    no_data: any;
    no_data_color: any;
    ranges: number[];
    colors: number[][];

    constructor(attribute: string, start_color: any, end_color: any, ranges: number[], no_data: number = -9999, no_data_color: any = [25, 25, 25, 0.5])
    {
        this.attribute = attribute;
        this.start_color = start_color;
        this.end_color = end_color;
        this.ranges = ranges.sort((a, b) => a < b ? -1: 1);
        this.colors = [];
        this.no_data = no_data;
        this.no_data_color = no_data_color;
        for (let i=0; i<=this.ranges.length; i++) {
            const r = this.start_color[0] + (this.end_color[0] - this.start_color[0]) * i / this.ranges.length;
            const g = this.start_color[1] + (this.end_color[1] - this.start_color[1]) * i / this.ranges.length;
            const b = this.start_color[2] + (this.end_color[2] - this.start_color[2]) * i / this.ranges.length;
            const a = this.start_color[3] + (this.end_color[3] - this.start_color[3]) * i / this.ranges.length;
            this.colors.push([r, g, b, a]);
        }
    }

    getRGBA(value: any) {
        if (value[this.attribute] === this.no_data) {
            return this.no_data_color;
        }
        for (let i=0; i<this.ranges.length; i++) {
            if (value[this.attribute] < this.ranges[i]) {
                return this.colors[i];
            }
        }
        return this.colors[this.colors.length-1];
    }

    getStyle(feature: any, resolution: any): Style 
    {
        return null;
    }
    getHighlightStyle(feature: any, resolution: any): Style 
    {
        return null;
    }
}

export { RasterStyle }