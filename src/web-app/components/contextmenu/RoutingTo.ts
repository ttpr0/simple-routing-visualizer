import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState } from '/state';
import { getMap } from '/map';
import { CONFIG } from "/config" 
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { PointStyle } from '/map/style';

const routing_to = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();

    function addRoutingBar() {
      const side_conf = CONFIG["app"]["sidebar"]
      let active = false
      for (let item of side_conf) {
        if (item.comp === "RoutingBar") {
          active = true
        }
      }
      if (active === false) {
        side_conf.push({
          comp: "RoutingBar",
          icon: "mdi-navigation-outline"
        })
      }
      state.sidebar.active = "RoutingBar"
    }

    function routingTo() {
      let layer = map.getLayerByName("routing_points")
      if (layer === undefined) {
        layer = new VectorLayer([], "Point", "routing_points")
        layer.setStyle(new PointStyle('red', 10, 'circle'))
        map.addLayer(layer)
      }
      const features = layer.getAllFeatures()
      for (let id of features) {
        const type = layer.getProperty(id, "type")
        if (type === "finish") {
          layer.removeFeature(id)
        }
      }
      let feature = {
        type: "Feature",
        properties: {
          type: "finish"
        },
        geometry: {
          type: "Point",
          coordinates: state.contextmenu.context.map_pos
        }
      }
      layer.addFeature(feature)
      state.contextmenu.display = false

      addRoutingBar()
    }

    return { routingTo }
  },
  template: `
    <topbarbutton @click="routingTo()">Navigieren nach</topbarbutton>
    `
}

export { routing_to }