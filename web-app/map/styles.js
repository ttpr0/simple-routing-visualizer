const defaultStyle = {
  'Point': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: 'black'}),
      stroke: new ol.style.Stroke({color: 'black'}),
      points: 3,
      radius: 10,
      angle: 0,
    })
  }),
  'LineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 3
    })
  }),
  'Polygon': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 2
    })
  }),
};
const highlightDefaultStyle = {
  'Point': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: 'lightseagreen'}),
      stroke: new ol.style.Stroke({color: 'lightseagreen'}),
      points: 3,
      radius: 10,
      angle: 0,
    })
  }),
  'LineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'lightseagreen',
      width: 2
    })
  }),
  'Polygon': new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0,255,255,0.5)'
    }),
    stroke: new ol.style.Stroke({
      color: 'lightseagreen',
      width: 3
    })
  }),
};

var width = 2;
function ors_style(feature, resolution) 
{
    return new ol.style.Style({stroke: new ol.style.Stroke({color: 'black', width: width})});
}
function mapbox_style(feature, resolution) 
{
    return new ol.style.Style({stroke: new ol.style.Stroke({color: 'red', width: width})});
}
function targamo_style(feature, resolution) 
{
    return new ol.style.Style({stroke: new ol.style.Stroke({color: 'green', width: width})});
}
function bing_style(feature, resolution) 
{
    return new ol.style.Style({stroke: new ol.style.Stroke({color: 'blue', width: width})});
}

var styleCache = {};
var blackStroke = new ol.style.Stroke({color: 'black'});
function styleFunction(feature, resolution) 
{
  var value = feature.getProperties().value;
  if (!value) 
  {
    value = 1000;
  }
  if (!styleCache[value]) 
  {
    v = value / rangeslider.value;
    styleCache[value] = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255*v, 255*(1-v), 0, 0.3]
      }),
      stroke: blackstroke,
    });
  }
  return styleCache[value];
}

var fills = [
  new ol.style.Fill({color: [35,120,163,0.8]}),
  new ol.style.Fill({color: [118,160,149,0.8]}),
  new ol.style.Fill({color: [181,201,131,0.8]}),
  new ol.style.Fill({color: [250,252,114,0.8]}),
  new ol.style.Fill({color: [253,179,80,0.8]}),
  new ol.style.Fill({color: [246,108,53,0.8]}),
  new ol.style.Fill({color: [233,21,30,0.8]})
]

var r = 3;
var styles = {
    300: new ol.style.Style({image: new ol.style.Circle({fill: fills[0], radius:r}), fill: fills[0]}),
    600: new ol.style.Style({image: new ol.style.Circle({fill: fills[1], radius:r}), fill: fills[1]}),
    900: new ol.style.Style({image: new ol.style.Circle({fill: fills[2], radius:r}), fill: fills[2]}),
    1200: new ol.style.Style({image: new ol.style.Circle({fill: fills[3], radius:r}), fill: fills[3]}),
    1800: new ol.style.Style({image: new ol.style.Circle({fill: fills[4], radius:r}), fill: fills[4]}),
    2700: new ol.style.Style({image: new ol.style.Circle({fill: fills[5], radius:r}), fill: fills[5]}),
    3600: new ol.style.Style({image: new ol.style.Circle({fill: fills[6], radius:r}), fill: fills[6]}),
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
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 10,
      })
    })
  }
  else
  {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'green',
        width: 2,
      })
    })
  }
}

export { defaultStyle, highlightDefaultStyle, accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, targamo_style, bing_style }