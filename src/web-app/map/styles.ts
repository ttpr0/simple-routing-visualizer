import { Style, Fill, RegularShape, Stroke, Circle } from "ol/style";

const defaultStyle = {
  'Point': new Style({
    image: new RegularShape({
      fill: new Fill({color: 'black'}),
      stroke: new Stroke({color: 'black'}),
      points: 3,
      radius: 10,
      angle: 0,
    })
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 3
    })
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 2
    })
  }),
};
const defaultHighlightStyle = {
  'Point': new Style({
    image: new RegularShape({
      fill: new Fill({color: 'lightseagreen'}),
      stroke: new Stroke({color: 'lightseagreen'}),
      points: 3,
      radius: 10,
      angle: 0,
    })
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'lightseagreen',
      width: 2
    })
  }),
  'Polygon': new Style({
    fill: new Fill({
      color: 'rgba(0,255,255,0.5)'
    }),
    stroke: new Stroke({
      color: 'lightseagreen',
      width: 3
    })
  }),
};

var width = 2;
function ors_style(feature, resolution) 
{
    return new Style({stroke: new Stroke({color: 'black', width: width})});
}
function mapbox_style(feature, resolution) 
{
    return new Style({stroke: new Stroke({color: 'red', width: width})});
}
function targamo_style(feature, resolution) 
{
    return new Style({stroke: new Stroke({color: 'green', width: width})});
}
function bing_style(feature, resolution) 
{
    return new Style({stroke: new Stroke({color: 'blue', width: width})});
}

var styleCache = {};
var blackStroke = new Stroke({color: 'black'});
function styleFunction(feature, resolution) 
{
  var value = feature.getProperties().value;
  if (!value) 
  {
    value = 1000;
  }
  if (!styleCache[value]) 
  {
    let v = value / 10;
    styleCache[value] = new Style({
      fill: new Fill({
        color: [255*v, 255*(1-v), 0, 0.3]
      }),
      stroke: blackStroke,
    });
  }
  return styleCache[value];
}

var fills = [
  new Fill({color: [35,120,163,0.8]}),
  new Fill({color: [118,160,149,0.8]}),
  new Fill({color: [181,201,131,0.8]}),
  new Fill({color: [250,252,114,0.8]}),
  new Fill({color: [253,179,80,0.8]}),
  new Fill({color: [246,108,53,0.8]}),
  new Fill({color: [233,21,30,0.8]})
]

var r = 3;
var styles = {
    300: new Style({image: new Circle({fill: fills[0], radius:r}), fill: fills[0]}),
    600: new Style({image: new Circle({fill: fills[1], radius:r}), fill: fills[1]}),
    900: new Style({image: new Circle({fill: fills[2], radius:r}), fill: fills[2]}),
    1200: new Style({image: new Circle({fill: fills[3], radius:r}), fill: fills[3]}),
    1800: new Style({image: new Circle({fill: fills[4], radius:r}), fill: fills[4]}),
    2700: new Style({image: new Circle({fill: fills[5], radius:r}), fill: fills[5]}),
    3600: new Style({image: new Circle({fill: fills[6], radius:r}), fill: fills[6]}),
};
function accessibilityStyleFunction(feature, resolution) 
{
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

const lineStyle = (final) => {
  if (final)
  {
    return new Style({
      stroke: new Stroke({
        color: '#ffcc33',
        width: 10,
      })
    })
  }
  else
  {
    return new Style({
      stroke: new Stroke({
        color: 'green',
        width: 2,
      })
    })
  }
}

export { defaultStyle, defaultHighlightStyle, accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, targamo_style, bing_style }