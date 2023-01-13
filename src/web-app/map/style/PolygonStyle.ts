import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { IStyle } from "./IStyle";

class PolygonStyle implements IStyle
{
    style: Style;
    highlight_style: Style;

    constructor(stroke_color: any = 'rgba(0,0,0,1)', width: number = 3, fill_color: any = null)
    {
        let stroke = new Stroke({
            color: stroke_color,
            width: width,
        });
        let fill;
        if (fill_color === null) {
            fill = null;
        }
        else {
            fill = new Fill({
                color: fill_color,
            });
        }

        let highlight_stroke = new Stroke({
            color: 'lightseagreen',
            width: width
        });
        let highlight_fill = new Fill({
            color: 'rgba(0,255,255,0.5)',
        })

        this.style = new Style({
            stroke: stroke,
            fill: fill,
        });
        this.highlight_style = new Style({
            stroke: highlight_stroke,
            fill: highlight_fill,
        });
    }

    getStrokeColor() {
        return this.style.getStroke().getColor();
    }
    setStrokeColor(color: any) {
        this.style.getStroke().setColor(color);
    }
    getWidth() {
        return this.style.getStroke().getWidth();
    }
    setWidth(width: number) {
        this.style.getStroke().setWidth(width);
        this.highlight_style.getStroke().setWidth(width);
    }
    getFillColor() {
        if (this.style.getFill() === null) {
            return null;
        }
        return this.style.getFill().getColor();
    }
    setFillColor(color: any) {
        if (color === null) {
            this.style.setFill(undefined);
        }
        else {
            this.style.setFill(new Fill({
                color: color,
            }));
        }
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

export { PolygonStyle }