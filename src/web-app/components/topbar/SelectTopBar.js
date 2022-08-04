import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer.js'
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { topbarcomp } from './TopBarComp.js';
import { DragBox } from "ol/interaction"
import { toLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';

const selecttopbar = {
    components: { topbarcomp },
    props: [ ],
    setup(props) {
      const state = getState();
      const map = getMap();

      function setFeatureInfo(feature, pos, display) {
        if (feature != null) state.featureinfo.feature = feature;
        if (pos != null) state.featureinfo.pos = pos;
        if (display != null) state.featureinfo.display = display;
      }

      function selectListener(e)
      {
        var count = 0;
        map.olmap.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
        {
          count++;
          if (layer.isSelected(feature))
          {
            layer.unselectFeature(feature);
          }
          else
          {
            layer.selectFeature(feature);
          }
        });
        if (count == 0)
        {
          map.layers.forEach(layer => {
            if (map.isVisibile(layer.name))
            {
              layer.unselectAll();
            }
          })
        }
      }

      function featureinfoListener(e)
      {
        map.olmap.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
        {
          setFeatureInfo(feature, e.pixel, true);
        });
      }

      function addpointListener(e)
      {
        var layer = map.getLayerByName(state.layertree.focuslayer);
        if (layer == null)
        {
          alert("pls select a layer to add point to!");
          return;
        }
        var feature = new Feature({
          geometry: new Point(e.coordinate),
          name: 'new Point',
        });
        layer.addFeature(feature);
      }

      function delpointListener(e)
      {
        map.olmap.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
        {
          if (layer.name === state.layertree.focuslayer)
          {
            layer.removeFeature(feature);
          }
        });
      }

      const dragBox = new DragBox();
      dragBox.on(['boxend'], function(e) {
          map.layers.forEach(layer => {
              if (map.isVisibile(layer.name))
              {
                  layer.unselectAll();
                  var box = dragBox.getGeometry().getExtent();
                  var ll = toLonLat([box[0], box[1]]);
                  var ur = toLonLat([box[2], box[3]]);
                  box = [ll[0], ll[1], ur[0], ur[1]];
                  layer.getSource().forEachFeatureInExtent(box, function(feature) {
                    layer.selectFeature(feature);
                  });
              }
          });
      });

      var featureinfoActive = ref(false);
      var selectActive = ref(false);
      activateSelect();
      var dragboxActive = ref(false);
      var addpointActive = ref(false);
      var delpointActive = ref(false);

      function activateDragBox()
      {
        if (dragboxActive.value)
        {
          map.removeInteraction(dragBox);
          dragboxActive.value = false;
        }
        else
        {
          map.addInteraction(dragBox);
          dragboxActive.value = true;
        }
      }

      function activateFeatureInfo()
      {
        if (featureinfoActive.value)
        {
          map.un('click', featureinfoListener);
          featureinfoActive.value = false;
        }
        else
        {
          map.on('click', featureinfoListener);
          featureinfoActive.value = true;
        }
      }

      function activateSelect() 
      {
        if (selectActive.value) 
        {
          map.un('click', selectListener);
          selectActive.value = false;
        }
        else 
        {
          map.on('click', selectListener);
          selectActive.value = true;
        }
      }

      function activateAddPoint() 
      {
        if (addpointActive.value) 
        {
          map.un('click', addpointListener);
          addpointActive.value = false;
        }
        else 
        {
          map.on('click', addpointListener);
          addpointActive.value = true;
        }
      }

      function activateDelPoint() 
      {
        if (delpointActive.value) 
        {
          map.un('click', delpointListener);
          delpointActive.value = false;
        }
        else 
        {
          map.on('click', delpointListener);
          delpointActive.value = true;
        }
      }

      return { activateDragBox, activateFeatureInfo, activateSelect, activateAddPoint, activateDelPoint, dragboxActive, selectActive, addpointActive, delpointActive, featureinfoActive }
    },
    template: `
    <topbarcomp name="Selection">
      <div class="container">
        <button :class="[{highlight:featureinfoActive},{bigbutton:true}]" @click="activateFeatureInfo()">
          Feature<br>Info
        </button>
      </div>
      <div class="container">
        <button :class="[{highlight:selectActive},{bigbutton:true}]" @click="activateSelect()">
          Features<br>auswählen
        </button>
      </div>
      <div class="container">
        <button :class="[{highlight:dragboxActive},{bigbutton:true}]" @click="activateDragBox()">
          im Rechteck<br>auswählen
        </button>
      </div>
    </topbarcomp>
    <topbarcomp name="Modify">
      <div class="container">
        <button :class="[{highlight:addpointActive},{bigbutton:true}]" @click="activateAddPoint()">
          Add<br> Point
        </button>
      </div>
      <div class="container">
        <button :class="[{highlight:delpointActive},{bigbutton:true}]" @click="activateDelPoint()">
          Delete<br> Point
        </button>
      </div>
    </topbarcomp>
    `
} 

export { selecttopbar }