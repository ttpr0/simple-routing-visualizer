import { reactive } from 'vue';

const state = reactive({
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

function getState()
{
    return state;
}

export { getState }

