import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { defaultStyle, defaultHighlightStyle } from "/map/styles";
import { IStyle } from "./IStyle";

class PointStyle implements IStyle
{
    style: Style;
    highlight_style: Style;

    constructor(color: any = 'black', radius: number = 10, type: string = "polygon", points: number = 3, inner_radius: number = 0)
    {
        let stroke = new Stroke({
            color: color,
        });
        let fill = new Fill({
            color: color,
        });
        let image;

        let highlight_stroke = new Stroke({
            color: 'lightseagreen',
        });
        let highlight_fill = new Fill({
            color: 'rgba(0,255,255,0.5)',
        });
        let highlight_image;

        if (type === 'polygon') {
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: points,
                radius: radius,
            });
            highlight_image = new RegularShape({
                fill: highlight_fill,
                stroke: highlight_stroke,
                points: points,
                radius: radius,
            });
        }
        if (type === 'circle') {
            image = new Circle({
                fill: fill,
                stroke: stroke,
                radius: radius,
            });
            highlight_image = new Circle({
                fill: highlight_fill,
                stroke: highlight_stroke,
                radius: radius,
            });
        }
        if (type === 'star') {
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: points,
                radius: radius,
                radius2: inner_radius,
            });
            highlight_image = new RegularShape({
                fill: highlight_fill,
                stroke: highlight_stroke,
                points: points,
                radius: radius,
                radius2: inner_radius,
            });
        }

        this.style = new Style({
            image: image,
        })
        this.highlight_style = new Style({
            image: highlight_image,
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

export { PointStyle }