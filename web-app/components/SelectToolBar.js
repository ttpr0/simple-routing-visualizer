import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer.js'
import { pointstyle, highlightpointstyle } from "/map/styles.js";
import { useStore } from 'vuex';
import { getMap } from '/map/maps.js';
import { toolbarcomp } from './ToolBarComp.js';

const selecttoolbar = {
    components: { toolbarcomp },
    props: [ ],
    setup(props) {
      const store = useStore();
      const map = getMap();

      function setFeatureInfo(feature, pos, display) {
        store.commit('setFeatureInfo', {feature, pos, display});
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
          map.vectorlayers.forEach(layer => {
            if (layer.display)
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
        var layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
        if (layer == null)
        {
          alert("pls select a layer to add point to!");
          return;
        }
        var feature = new ol.Feature({
          geometry: new ol.geom.Point(e.coordinate),
          name: 'new Point',
        });
        layer.addFeature(feature);
      }

      function delpointListener(e)
      {
        map.olmap.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
        {
          if (layer.name === store.state.layertree.focuslayer)
          {
            layer.removeFeature(feature);
          }
        });
      }

      const dragBox = new ol.interaction.DragBox();
      dragBox.on(['boxend'], function(e) {
          map.vectorlayers.forEach(layer => {
              if (layer.display)
              {
                  layer.unselectAll();
                  var box = dragBox.getGeometry().getExtent();
                  var ll = ol.proj.toLonLat([box[0], box[1]]);
                  var ur = ol.proj.toLonLat([box[2], box[3]]);
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
    <div class="selecttoolbar">
      <toolbarcomp name="Selection">
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
      </toolbarcomp>
      <toolbarcomp name="Modify">
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
      </toolbarcomp>
    </div>
    `
} 

export { selecttoolbar }