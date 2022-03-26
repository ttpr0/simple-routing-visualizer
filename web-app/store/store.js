import { createStore } from 'vuex';

const store = createStore({
    state: {
        featureinfo: {
            feature: null,
            pos: [0,0],
            display: false,
        },
        layertree: {
            update: false,
            focuslayer: null,
        },
    },
    mutations: {
        setFeatureInfo (state, c) {
            if (c.feature != null) state.featureinfo.feature = c.feature;
            if (c.pos != null) state.featureinfo.pos = c.pos;
            if (c.display != null) state.featureinfo.display = c.display;
        },
        setFocusLayer (state, layer) {
            state.layertree.focuslayer = layer;
        },
        updateLayerTree (state) {
            state.layertree.update = !state.layertree.update;
        },
    }
})

export {store}

