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
        running: false,
    }
})

function getState()
{
    return state;
}

export { getState }

