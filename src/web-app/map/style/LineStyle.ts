import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { defaultStyle, defaultHighlightStyle } from "/map/styles";
import { IStyle } from "./IStyle";

class LineStyle implements IStyle
{
    style: Style;
    highlight_style: Style;

    constructor(color: any = 'black', width: number = 3)
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