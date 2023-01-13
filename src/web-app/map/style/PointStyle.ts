import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { IStyle } from "./IStyle";

class PointStyle implements IStyle
{
    color: any;
    radius: number;
    type: string;
    points: number;
    inner_radius: number;

    style: Style;
    highlight_style: Style;

    constructor(color: any = 'rgba(0,0,0,1)', radius: number = 10, type: string = "polygon", points: number = 3, inner_radius: number = 0)
    {
        this.color = color;
        this.radius = radius;
        this.type = type;
        this.points = points;
        this.inner_radius = inner_radius;
        this.createStyles();
    }

    createStyles() {
        let stroke = new Stroke({
            color: this.color,
        });
        let fill = new Fill({
            color: this.color,
        });
        let image;

        let highlight_stroke = new Stroke({
            color: 'lightseagreen',
        });
        let highlight_fill = new Fill({
            color: 'rgba(0,255,255,0.5)',
        });
        let highlight_image;

        if (this.type === 'polygon') {
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: this.points,
                radius: this.radius,
            });
            highlight_image = new RegularShape({
                fill: highlight_fill,
                stroke: highlight_stroke,
                points: this.points,
                radius: this.radius,
            });
        }
        if (this.type === 'circle') {
            image = new Circle({
                fill: fill,
                stroke: stroke,
                radius: this.radius,
            });
            highlight_image = new Circle({
                fill: highlight_fill,
                stroke: highlight_stroke,
                radius: this.radius,
            });
        }
        if (this.type === 'star') {
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: this.points,
                radius: this.radius,
                radius2: this.inner_radius,
            });
            highlight_image = new RegularShape({
                fill: highlight_fill,
                stroke: highlight_stroke,
                points: this.points,
                radius: this.radius,
                radius2: this.inner_radius,
            });
        }

        this.style = new Style({
            image: image,
        })
        this.highlight_style = new Style({
            image: highlight_image,
        });
    }

    getColor() {
        return this.color;
    }
    setColor(color: any) {
        this.color = color;
        this.createStyles();
    }
    getRadius() {
        return this.radius;
    }
    setRadius(radius: number) {
        this.radius = radius;
        this.createStyles();
    }
    getType() {
        return this.type;
    }
    setType(type: string) {
        this.type = type;
        this.createStyles();
    }
    getPoints() {
        return this.points;
    }
    setPoints(points: number) {
        this.points = points;
        this.createStyles();
    }
    getInnerRadius() {
        return this.inner_radius;
    }
    setInnerRadius(inner_radius: number) {
        this.inner_radius = inner_radius;
        this.createStyles();
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