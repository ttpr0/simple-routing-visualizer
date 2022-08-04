import { reactive } from 'vue';

class AppState
{
    featureinfo = {
        feature: null,
        pos: [0,0],
        display: false,
    }
    layertree = {
        update: false,
        focuslayer: null,
    }
    toolbox = {
        update: false,
    }
    map = {
        moved: false,
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
    }

    addFeature() 
    {
        return null;
    }
}


const state1 = reactive({
    featureinfo: {
        feature: null,
        pos: [0,0],
        display: false,
    },
    layertree: {
        update: false,
        focuslayer: null,
    },
    toolbox: {
        update: false,
    },
    map: {
        moved: false,
    },
    filetree: {
        connections: []
    },
    tools: {
        toolinfo: {
            show: false,
            text: "",
            pos: [0,0]
        },
        currtool: "",
        state: null,
    }
})

const state = reactive(new AppState())

function getState()
{
    return state;
}

export { getState }

