import { reactive } from "vue";
import config from "./config.json"
import { zoom, position, focus_layer, osm_link } from "/components/footer"
import { layerbar, filesbar, toolbar, routingbar, accessibilitybar } from "/components/sidebar";
import { map_addlayer, map_addpoint, map_delpoint, map_dragbox, open_directory, open_file, open_toolbox, feature_info, feature_select, open_accessibility } from "/components/topbar";
import { feature_info_popup } from "/components/popup";
import { routing_from, routing_to } from "/components/contextmenu";

const CONFIG = reactive(config);

const FOOTERCOMPS = {
    "Zoom": zoom,
    "Position": position,
    "Layer": focus_layer,
    "OSMLink": osm_link
}

const SIDEBARCOMPS = {
    "LayerBar": layerbar,
    "SymbologyBar": {},
    "ToolBar": toolbar,
    "FileBar": filesbar,
    "RoutingBar": routingbar,
    "AccessibilityBar": accessibilitybar,
}

const TOPBARCOMPS = {
    "FeatureInfo": feature_info,
    "FeatureSelect": feature_select,
    "MapDragbox": map_dragbox,
    "MapAddPoint": map_addpoint,
    "MapDelPoint": map_delpoint,
    "MapAddLayer": map_addlayer,
    "OpenFile": open_file,
    "OpenDirectory": open_directory,
    "OpenToolbox": open_toolbox,
    "RoutingFrom": routing_from,
    "RoutingTo": routing_to,
    "OpenAccessibility": open_accessibility
}

const POPUPCOMPS = {
    "FeatureInfo": feature_info_popup
}

export { CONFIG, FOOTERCOMPS, SIDEBARCOMPS, TOPBARCOMPS, POPUPCOMPS }