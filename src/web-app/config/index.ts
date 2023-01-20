import { reactive } from "vue";
import config from "./config.json"
import { zoom, position, focus_layer, osm_link } from "/components/footer"
import { layerbar, filesbar, toolbar, routingbar, accessibilitybar, symbologybar } from "/components/sidebar";
import { map_addlayer, map_addpoint, map_delpoint, map_dragbox, open_directory, open_file, open_toolbox, feature_info, feature_select, open_accessibility } from "/components/topbar";
import { feature_info_popup } from "/components/popup";
import { routing_from, routing_to, remove_layer, add_to_map, create_new, close_connection, refresh_connection } from "/components/contextmenu";
import { basic_tool_info } from "/components/window";

const CONFIG = reactive(config);

const FOOTERCOMPS = {
    "Zoom": zoom,
    "Position": position,
    "Layer": focus_layer,
    "OSMLink": osm_link
}

const SIDEBARCOMPS = {
    "LayerBar": layerbar,
    "SymbologyBar": symbologybar,
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
    "OpenAccessibility": open_accessibility,
    "RemoveLayer": remove_layer,
    "AddToMap": add_to_map,
    "CreateNew": create_new,
    "CloseConnection": close_connection,
    "RefreshConnection": refresh_connection
}

const POPUPCOMPS = {
    "FeatureInfo": feature_info_popup
}

const WINDOWCOMPS = {
    "BasicToolInfo": basic_tool_info
}

export { CONFIG, FOOTERCOMPS, SIDEBARCOMPS, TOPBARCOMPS, POPUPCOMPS, WINDOWCOMPS }