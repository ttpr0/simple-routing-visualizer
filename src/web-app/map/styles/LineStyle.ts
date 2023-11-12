

interface ILineStyle {
    getColor(feature): number[];
    getWidth(feature): number;
}

class LineStyle implements ILineStyle {
    color: number[];
    width: number;

    constructor(color: number[] = [0, 0, 0, 255], width: number = 1000) {
        this.color = color;
        this.width = width;
    }

    setColor(fill: number[]) {
        this.color = fill;
    }
    setWidth(width: number) {
        this.width = width;
    }

    getColor(feature): number[] {
        return this.color;
    }
    getWidth(feature): number {
        return this.width;
    }
}

export { ILineStyle, LineStyle }