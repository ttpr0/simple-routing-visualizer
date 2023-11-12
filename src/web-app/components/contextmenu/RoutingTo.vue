<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Circle, Fill, Stroke } from "ol/style";
import { getAppState, getToolbarState } from "/state";
import { getMap } from "/map";
import { CONFIG } from "/config";
import { topbarbutton } from "/share_components/topbar/TopBarButton";
import { PointStyle } from "/map/style";

export default {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const toolbar = getToolbarState();

    function addRoutingBar() {
      const side_conf = CONFIG["app"]["sidebar"];
      let active = false;
      for (let item of side_conf) {
        if (item.comp === "RoutingBar") {
          active = true;
        }
      }
      if (active === false) {
        side_conf.push({
          comp: "RoutingBar",
          icon: "mdi-navigation-outline",
        });
      }
      state.sidebar.active = "RoutingBar";
    }

    function routingTo() {
      let layer = map.getOLLayer("routing_points") as VectorLayer<VectorSource>;
      if (layer === undefined) {
        layer = new VectorLayer({
          source: new VectorSource({
            features: [],
          }),
          style: function (feature, resolution) {
            const type = feature.get("type");
            if (type === "start") {
              return new Style({
                image: new Circle({
                  fill: new Fill({
                    color: "red",
                  }),
                  stroke: new Stroke({
                    color: "black",
                  }),
                  radius: 10,
                }),
              });
            } else {
              return new Style({
                image: new Circle({
                  fill: new Fill({
                    color: "blue",
                  }),
                  stroke: new Stroke({
                    color: "black",
                  }),
                  radius: 10,
                }),
              });
            }
          },
        });
        map.addOLLayer("routing_points", layer);
      }
      for (let feat of layer.getSource().getFeatures()) {
        const type = feat.get("type");
        if (type === "finish") {
          layer.getSource().removeFeature(feat);
        }
      }

      let feature = new Feature({
        geometry: new Point(state.contextmenu.context.map_pos),
        type: "finish",
      });
      layer.getSource().addFeature(feature);

      for (let feat of layer.getSource().getFeatures()) {
        let type = feat.get("type");
        if (type === "start")
          toolbar.toolview.params["startpoint"] = (
            feat.getGeometry() as Point
          ).getCoordinates();
        if (type === "finish")
          toolbar.toolview.params["endpoint"] = (
            feat.getGeometry() as Point
          ).getCoordinates();
      }
      state.contextmenu.display = false;

      state.sidebar.active = "ToolBar";
      toolbar.toolview.tool = "Routing";
      toolbar.toolview.toolbox = "RoutingTools";
      //addRoutingBar()
    }

    return { routingTo };
  },
};
</script>

<template>
  <topbarbutton @click="routingTo()">Navigieren nach</topbarbutton>
</template>

<style scoped>
</style>