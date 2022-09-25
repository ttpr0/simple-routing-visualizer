import { ITool } from "/tools/ITool";
import { getMapState } from "/state";

const map = getMapState();

class TestTool implements ITool
{
    name: string = "TestTool";
    getParameterInfo(): object[] {
        throw new Error("Method not implemented.");
    }
    getOutputInfo(): object[] {
        throw new Error("Method not implemented.");
    }
    param = [
        {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [10,100, 10], text:"check?", default: 90},
        {name: "test", title: "Test", info: "das ist ein Testfeld", type: "list", values: [1,100], text:"check?", default: [1,200,1000]},
        {name: 'url', title: 'URL', info: 'URL zum ORS-Server (bis zum API-Endpoint, z.B. localhost:5000/v2)', type: 'text', text: 'API-URL', default: 'http://localhost:8082/v2'},
        {name: "layer", title: "Layer", info: "Input-Standorte für Isochronen-Berechnung als Point-Features", type: "layer", layertype:'Point', text:"Layer:"},
        {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,3600,100], text:"check?", default: 900},
        {name: "count", title: "Intervalle", info: "Anzahl an Intervallen", type: "range", values: [1,10,1], text:"check?", default: 1},
        {name: "profile", title: "Profile", info: "Zu verwendendes Routing-Profile/Routing-Graphen", type: "select", values: ['driving-car'], text:"Profile", default: 'driving-car'},
        {name: "smoothing", title: "Smoothing", info: "Smoothing-Faktor zur Isochronen-Berechnung (je höher desto stärker vereinfacht, je niedriger desto mehr Details)", type: "range", values: [1,10,0.1], default: 5},
        {name: "travelmode", title: "Travel Mode", info: "Gibt Einheit der Reichweiten an (time=[s], distance=[m])", type: "select", values: ['time', 'distance'], text:"Travel-Mode", default: 'time'},
        {name: "locationtype", title: "Location Type", info: "Gibt an ob Routing an locations starten (Routing vorwärts) oder enden (Routing rückwärts) soll", type: "select", values: ['start', 'destination'], text:"Location-Type", default: 'destination'},
        {name: "outputtype", title: "Output Type", info: "Gibt an ob Polygone vollständig oder als Ringe (kleinere Polygone von größeren abgezogen) zurückgegeben werden sollen", type: "select", values: ['polygon ring', 'full polygon'], text:'Output-Type', default: 'full polygon'},
        {name: 'outname', title: 'Output Name', info: 'Name des Output-Layers', type: 'text', text: 'Name', default: 'dockerlayer'},
    ]
    
    out = [
    ]
    
    async run(param, out, addMessage) {
        addMessage("Test-Message")
        addMessage("started");
        await sleep(5000);
        addMessage(param.select);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
    setTimeout(resolve, ms);
    });
}

const tool = new TestTool();

import { tool as test } from './TestTool'

const toolbox = {
    name: "TestTools",
    tools: [ tool, test ]
}

export { toolbox }