import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState } from '/state';
import { topbaritem } from '/components/topbar/TopBarItem';
import { topbarbutton } from '/components/topbar/TopBarButton';
import { topbarseperator } from '/components/topbar/TopBarSeperator';
import { Point } from 'ol/geom';
import { Feature } from 'ol';

const selecttopbar = {
    components: { topbaritem, topbarbutton, topbarseperator },
    props: [ "active" ],
    emits: [ "click", "hover" ],
    setup(props) {
      const state = getAppState();
      const map = getMapState();

      function setFeatureInfo(feature, pos, display) {
        if (feature != null) state.featureinfo.feature = feature;
        if (pos != null) state.featureinfo.pos = pos;
        if (display != null) state.featureinfo.display = display;
      }

      function selectListener(e)
      {
        var count = 0;
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
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
          map.forEachLayer(layer => {
            if (map.isVisibile(layer.name))
            {
              layer.unselectAll();
            }
          })
        }
      }

      function featureinfoListener(e)
      {
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
        {
          setFeatureInfo(feature, e.pixel, true);
        });
      }

      function addpointListener(e)
      {
        var layer = map.getLayerByName(map.focuslayer);
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
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
        {
          if (layer.name === map.focuslayer)
          {
            layer.removeFeature(feature);
          }
        });
      }

      var featureinfoActive = ref(false);
      var selectActive = ref(false);
      activateSelect();
      var dragboxActive = computed(() => map.dragbox_active);
      var addpointActive = ref(false);
      var delpointActive = ref(false);

      function activateDragBox()
      {
        if (dragboxActive.value)
        {
          map.deactivateDragBox();
        }
        else
        {
          map.activateDragBox();
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
    <topbaritem name="Select" :active="active" @click="$emit('click')" @hover="$emit('hover')">
      <topbarbutton :active="featureinfoActive" @click="activateFeatureInfo()">Feature Info</topbarbutton>
      <topbarbutton :active="selectActive" @click="activateSelect()">Features Auswählen</topbarbutton>
      <topbarbutton :active="dragboxActive" @click="activateDragBox()">im Rechteck auswählen</topbarbutton>
      <topbarseperator></topbarseperator>
      <topbarbutton :active="addpointActive" @click="activateAddPoint()">Add Point</topbarbutton>
      <topbarbutton :active="delpointActive" @click="activateDelPoint()">Delete Point</topbarbutton>
    </topbaritem>
    `
} 

export { selecttopbar }