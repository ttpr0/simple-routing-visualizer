import { reactive } from 'vue';
import { AppState } from './AppState';
import { MapState } from './MapState';
import { ToolbarState } from './ToolbarState';

const APP_STATE = reactive(new AppState());
const MAP_STATE = reactive(new MapState());
const TOOLBAR_STATE = reactive(new ToolbarState());

function getAppState()
{
    return APP_STATE;
}

function getMapState()
{
    return MAP_STATE;
}

function getToolbarState()
{
    return TOOLBAR_STATE;
}

export { getAppState, getMapState, getToolbarState }