import { reactive } from "vue";
import config from "./config.json"
import { zoom, position, focus_layer, osm_link, img_attribution } from "/components/footer"
import { layerbar, filesbar, toolbar, routingbar, accessibilitybar, symbologybar, settingsbar } from "/components/sidebar";
import { map_addlayer, map_addpoint, map_delpoint, map_dragbox, open_directory, open_file, open_toolbox, feature_info, feature_select, open_accessibility } from "/components/topbar";
import { routing_from, routing_to, remove_layer, add_to_map, create_new, close_connection, refresh_connection, rename_layer } from "/components/contextmenu";
import { file_select } from "/components/window";
import { basic_tool_info, feature_info as feature_info_window } from "/components/infobar";

const CONFIG = reactive(config);

const FOOTERCOMPS = {
    "Zoom": zoom,
    "Position": position,
    "Layer": focus_layer,
    "OSMLink": osm_link,
    "ImgAttribution": img_attribution,
}

const SIDEBARCOMPS = {
    "LayerBar": layerbar,
    "SymbologyBar": symbologybar,
    "ToolBar": toolbar,
    "FileBar": filesbar,
    "RoutingBar": routingbar,
    "AccessibilityBar": accessibilitybar,
    "SettingsBar": settingsbar,
}

const INFOBARCOMPS = {
    "ToolInfo": basic_tool_info,
    "FeatureInfo": feature_info_window
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
    "RefreshConnection": refresh_connection,
    "RenameLayer": rename_layer,
}

const WINDOWCOMPS = {
    "FileSelect": file_select,
}

export { CONFIG, FOOTERCOMPS, SIDEBARCOMPS, TOPBARCOMPS, INFOBARCOMPS, WINDOWCOMPS }