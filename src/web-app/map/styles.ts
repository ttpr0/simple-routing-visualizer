import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";
import { IStyle } from "./style/IStyle";

const fills = [
  new Fill({color: [35,120,163,0.8]}),
  new Fill({color: [118,160,149,0.8]}),
  new Fill({color: [181,201,131,0.8]}),
  new Fill({color: [250,252,114,0.8]}),
  new Fill({color: [253,179,80,0.8]}),
  new Fill({color: [246,108,53,0.8]}),
  new Fill({color: [233,21,30,0.8]})
]
const r = 3;
const styles = {
    300: new Style({image: new Circle({fill: fills[0], radius:r}), fill: fills[0]}),
    600: new Style({image: new Circle({fill: fills[1], radius:r}), fill: fills[1]}),
    900: new Style({image: new Circle({fill: fills[2], radius:r}), fill: fills[2]}),
    1200: new Style({image: new Circle({fill: fills[3], radius:r}), fill: fills[3]}),
    1800: new Style({image: new Circle({fill: fills[4], radius:r}), fill: fills[4]}),
    2700: new Style({image: new Circle({fill: fills[5], radius:r}), fill: fills[5]}),
    3600: new Style({image: new Circle({fill: fills[6], radius:r}), fill: fills[6]}),
};
class AccessibilityStyle implements IStyle
{
  getStyle(feature: any, resolution: any): Style {
    var value = feature.getProperties().value;
    if (value > 2700 || value < 0) 
    {
      value = 3600;
    }
    if  (value <= 300)
    {
      value = 300;
    }
    else if  (value <= 600)
    {
      value = 600;
    }
    else if  (value <= 900)
    {
      value = 900;
    }
    else if  (value <= 1200)
    {
      value = 1200;
    }
    else if  (value <= 1800)
    {
      value = 1800;
    }
    else if  (value <= 2700)
    {
      value = 2700;
    }
    return styles[value];
  }
  getHighlightStyle(feature: any, resolution: any): Style {
    return this.getStyle(feature, resolution);
  }
}

export { AccessibilityStyle }