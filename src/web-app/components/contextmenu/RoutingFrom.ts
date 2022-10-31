import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState } from '/state';
import { CONFIG } from "/config" 
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const routing_from = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMapState();

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

    function routingFrom() {
      let layer = map.getLayerByName("routing_points")
      if (layer === undefined) {
        layer = new VectorLayer([], "Point", "routing_points")
        map.addLayer(layer)
      }
      const features = layer.getAllFeatures()
      for (let id of features) {
        const type = layer.getProperty(id, "type")
        if (type === "start") {
          layer.removeFeature(id)
        }
      }
      let feature = {
        type: "Feature",
        properties: {
          type: "start"
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

    return { routingFrom }
  },
  template: `
    <topbarbutton @click="routingFrom()">Navigieren von</topbarbutton>
    `
}

export { routing_from }