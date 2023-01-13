import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { IStyle } from "./IStyle";

class LineStyle implements IStyle
{
    style: Style;
    highlight_style: Style;

    constructor(color: any = 'rgba(0,0,0,1)', width: number = 3)
    {
        let stroke = new Stroke({
            color: color,
            width: width
        });
        let highlight_stroke = new Stroke({
            color: 'lightseagreen',
            width: width
        });

        this.style = new Style({
            stroke: stroke
        });
        this.highlight_style = new Style({
            stroke: highlight_stroke
        });
    }

    getColor() {
        return this.style.getStroke().getColor();
    }
    setColor(color: any) {
        this.style.getStroke().setColor(color);
    }
    getWidth() {
        return this.style.getStroke().getWidth();
    }
    setWidth(width: number) {
        this.style.getStroke().setWidth(width);
        this.highlight_style.getStroke().setWidth(width);
    }

    getStyle(feature: any, resolution: any): Style 
    {
        return this.style;
    }
    getHighlightStyle(feature: any, resolution: any): Style 
    {
        return this.highlight_style;
    }
}

export { LineStyle }