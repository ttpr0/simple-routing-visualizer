

interface IPolygonStyle {
    isFilled(): boolean;
    isStroked(): boolean;

    getFillColor(feature): number[];
    getStrokeColor(feature): number[];
}

class PolygonStyle implements IPolygonStyle {
    is_filled: boolean;
    is_stroked: boolean;

    fill_color: number[];
    stroke_color: number[];
    radius: number;

    constructor(fill_color: number[] = [0, 0, 0, 255], stroke_color: number[] = [0, 0, 0, 255]) {
        this.fill_color = fill_color;
        this.stroke_color = stroke_color;
    }


    setColor(fill: number[], stroke: number[]) {
        this.fill_color = fill;
        this.stroke_color = stroke;
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
}

class AccessibilityStyle implements IPolygonStyle {
    fills = {
        300: [35, 120, 163, 200],
        600: [118, 160, 149, 200],
        900: [181, 201, 131, 200],
        1200: [250, 252, 114, 200],
        1800: [253, 179, 80, 200],
        2700: [246, 108, 53, 200],
        3600: [233, 21, 30, 200],
    }

    setColor(fill: number[], stroke: number[]) { }

    isFilled(): boolean {
        return true;
    }
    isStroked(): boolean {
        return false;
    }

    getFillColor(feature): number[] {
        var value = feature["properties"].value;
        if (value > 2700 || value < 0) {
            value = 3600;
        }
        if (value <= 300) {
            value = 300;
        }
        else if (value <= 600) {
            value = 600;
        }
        else if (value <= 900) {
            value = 900;
        }
        else if (value <= 1200) {
            value = 1200;
        }
        else if (value <= 1800) {
            value = 1800;
        }
        else if (value <= 2700) {
            value = 2700;
        }
        return this.fills[value];
    }
    getStrokeColor(feature): number[] {
        return null;
    }
}

export { IPolygonStyle, PolygonStyle, AccessibilityStyle }