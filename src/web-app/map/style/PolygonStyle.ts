import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { defaultStyle, defaultHighlightStyle } from "/map/styles";
import { IStyle } from "./IStyle";

class PolygonStyle implements IStyle
{
    style: Style;
    highlight_style: Style;

    constructor(stroke_color: any = 'black', width: number = 3, fill_color: any = null)
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