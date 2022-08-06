class AppState
{
    topbar = {
        active: 'select',
    }

    sidebar = {
        active: '',
    }

    featureinfo = {
        feature: null,
        pos: [0,0],
        display: false,
    }

    toolbox = {
        update: false,
    }

    filetree = {
        connections: []
    }

    tools = {
        toolinfo: {
            show: false,
            text: "",
            pos: [0,0]
        },
        currtool: "",
        state: null,
        running: "",
    }
}

export { AppState }