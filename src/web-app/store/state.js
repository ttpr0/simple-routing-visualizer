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
})

function getState()
{
    return state;
}

export { getState }

