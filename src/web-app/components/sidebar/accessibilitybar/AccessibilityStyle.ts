import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { IStyle } from '/map/style/IStyle';

const fills = [
    new Fill({ color: [0, 0, 0, 0.8] }),
    new Fill({ color: [128, 0, 0, 0.8] }),
    new Fill({ color: [128, 25, 0, 0.8] }),
    new Fill({ color: [128, 50, 0, 0.8] }),
    new Fill({ color: [128, 75, 0, 0.8] }),
    new Fill({ color: [128, 100, 0, 0.8] }),
    new Fill({ color: [128, 125, 0, 0.8] }),
    new Fill({ color: [128, 150, 0, 0.8] }),
    new Fill({ color: [128, 180, 0, 0.8] }),
    new Fill({ color: [128, 210, 0, 0.8] }),
    new Fill({ color: [128, 240, 0, 0.8] }),
];
const r = 3;
const styles = {
    0: new Style({ image: new Circle({ fill: fills[0], radius: r })}),
    10: new Style({ image: new Circle({ fill: fills[1], radius: r })}),
    20: new Style({ image: new Circle({ fill: fills[2], radius: r })}),
    30: new Style({ image: new Circle({ fill: fills[3], radius: r })}),
    40: new Style({ image: new Circle({ fill: fills[4], radius: r })}),
    50: new Style({ image: new Circle({ fill: fills[5], radius: r })}),
    60: new Style({ image: new Circle({ fill: fills[6], radius: r })}),
    70: new Style({ image: new Circle({ fill: fills[7], radius: r })}),
    80: new Style({ image: new Circle({ fill: fills[8], radius: r })}),
    90: new Style({ image: new Circle({ fill: fills[9], radius: r })}),
    100: new Style({ image: new Circle({ fill: fills[10], radius: r })}),
};


class AccessibilityStyle implements IStyle
{
    getStyle(feature: any, resolution: any): Style {
        var value = feature.getProperties().value;
        if (value < 0) {
            value = 0;
        }
        else if (value <= 10) {
            value = 10;
        }
        else if (value <= 20) {
            value = 20;
        }
        else if (value <= 30) {
            value = 30;
        }
        else if (value <= 40) {
            value = 40;
        }
        else if (value <= 50) {
            value = 50;
        }
        else if (value <= 60) {
            value = 60;
        }
        else if (value <= 70) {
            value = 70;
        }
        else if (value <= 80) {
            value = 80;
        }
        else if (value <= 90) {
            value = 90;
        }
        else if (value <= 100) {
            value = 100;
        }
        return styles[value];
    }
    getHighlightStyle(feature: any, resolution: any): Style {
        return this.getStyle(feature, resolution);
    }
}

export { AccessibilityStyle }