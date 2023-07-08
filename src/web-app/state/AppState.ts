class AppState
{
    topbar = {
        active: null,
    }

    sidebar = {
        active: '',
        width: 300,
    }

    infobar = {
        active: "",
        height: 300,
    }

    featureinfo = {
        features: [],
    }

    popup = {
        type: null,
        pos: [0,0],
        display: false,
    }

    contextmenu = {
        context: {
            map_pos: [0, 0],
            layer: null,
            path: null,
            name: null,
            type: null,
        },
        pos: [0, 0],
        display: false,
        type: null,
    }

    window = {
        show: false,
        pos: [0,0],
        icon: "mdi-information-outline",
        name: "Window",
        type: null,
        context: {} as any,
    }

    filetree = {
        connections: {}
    }
}

export { AppState }