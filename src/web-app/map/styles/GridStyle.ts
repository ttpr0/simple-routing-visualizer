

interface IGridStyle {
    getColor(props): number[];
}

class GridStyle implements IGridStyle {
    attribute: string;
    start_color: any;
    end_color: any;
    no_data: any;
    no_data_color: any;
    ranges: number[];
    colors: number[][];

    constructor(attribute: string, start_color: any, end_color: any, ranges: number[], no_data: number = -9999, no_data_color: any = [25, 25, 25, 0.5]) {
        this.attribute = attribute;
        this.start_color = start_color;
        this.end_color = end_color;
        this.ranges = ranges.sort((a, b) => a < b ? -1 : 1);
        this.colors = [];
        this.no_data = no_data;
        this.no_data_color = no_data_color;
        for (let i = 0; i <= this.ranges.length; i++) {
            const r = Math.floor(this.start_color[0] + (this.end_color[0] - this.start_color[0]) * i / this.ranges.length);
            const g = Math.floor(this.start_color[1] + (this.end_color[1] - this.start_color[1]) * i / this.ranges.length);
            const b = Math.floor(this.start_color[2] + (this.end_color[2] - this.start_color[2]) * i / this.ranges.length);
            const a = Math.floor(this.start_color[3] + (this.end_color[3] - this.start_color[3]) * i / this.ranges.length);
            this.colors.push([r, g, b, a]);
        }
    }

    getColor(props: any) {
        if (props[this.attribute] === this.no_data) {
            return this.no_data_color;
        }
        for (let i = 0; i < this.ranges.length; i++) {
            if (props[this.attribute] < this.ranges[i]) {
                return this.colors[i];
            }
        }
        return this.colors[this.colors.length - 1];
    }

    getRGBA(props) {
        return this.getColor(props);
    }
}

class ContinousGridStyle implements IGridStyle {
    attribute;
    start_color;
    end_color;
    no_data;
    no_data_color;
    start;
    end;

    constructor(attribute: string, start_color: any, end_color: any, start: number, end: number, no_data: number = -9999, no_data_color: any = [25, 25, 25, 0.5]) {
        this.attribute = attribute;
        this.start_color = start_color;
        this.end_color = end_color;
        this.start = start;
        this.end = end;
        this.no_data = no_data;
        this.no_data_color = no_data_color;
    }

    getColor(props) {
        const val = props[this.attribute];

        if (val === this.no_data) {
            return this.no_data_color;
        }

        const factor = (val - this.start) / (this.end - this.start);
        const r = Math.floor(this.start_color[0] + (this.end_color[0] - this.start_color[0]) * factor);
        const g = Math.floor(this.start_color[1] + (this.end_color[1] - this.start_color[1]) * factor);
        const b = Math.floor(this.start_color[2] + (this.end_color[2] - this.start_color[2]) * factor);
        const a = Math.floor(this.start_color[3] + (this.end_color[3] - this.start_color[3]) * factor);

        return [r, g, b, a];
    }

    getRGBA(props) {
        return this.getColor(props);
    }
}

export { IGridStyle, GridStyle, ContinousGridStyle }