class AppState
{
    topbar = {
        active: null,
    }

    sidebar = {
        active: '',
    }

    featureinfo = {
        feature: null,
        pos: [0,0],
        display: false,
    }

    popup = {
        type: null,
        feature: null,
        pos: [0,0],
        display: false,
    }

    contextmenu = {
        map_pos: [0, 0],
        pos: [0, 0],
        display: false,
    }

    filetree = {
        connections: []
    }
}

export { AppState }