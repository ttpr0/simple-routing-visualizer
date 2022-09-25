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

    filetree = {
        connections: []
    }
}

export { AppState }