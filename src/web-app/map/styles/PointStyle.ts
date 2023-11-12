

interface IPointStyle {
    isFilled(): boolean;
    isStroked(): boolean;

    getFillColor(feature): number[];
    getStrokeColor(feature): number[];
    getRadius(feature): number;
}

class PointStyle implements IPointStyle {
    is_filled: boolean;
    is_stroked: boolean;

    fill_color: number[];
    stroke_color: number[];
    radius: number;

    constructor(fill_color: number[] = [0, 0, 0, 255], stroke_color: number[] = [0, 0, 0, 255], radius: number = 100) {
        this.fill_color = fill_color;
        this.stroke_color = stroke_color;
        this.radius = radius;
    }


    setColor(fill: number[], stroke: number[]) {
        this.fill_color = fill;
        this.stroke_color = stroke;
    }
    setRadius(radius: number) {
        this.radius = radius;
    }

    isFilled(): boolean {
        return true;
    }
    isStroked(): boolean {
        return true;
    }

    getFillColor(feature): number[] {
        return this.fill_color;
    }
    getStrokeColor(feature): number[] {
        return this.stroke_color;
    }
    getRadius(feature): number {
        return this.radius;
    }
}

export { IPointStyle, PointStyle }