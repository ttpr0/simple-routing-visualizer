import { ITool } from "/components/sidebar/toolbar/ITool";
import { getMap } from '/map';

const map = getMap();

class TestTool implements ITool
{
    name: string = "TestTool";
    param = [
        {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [10,100, 10], text:"check?"},
        {name: "test", title: "Test", info: "das ist ein Testfeld", type: "list", values: [1,100], text:"check?" },
        {name: 'url', title: 'URL', info: 'URL zum ORS-Server (bis zum API-Endpoint, z.B. localhost:5000/v2)', type: 'text', text: 'API-URL'},
        {name: "layer", title: "Layer", info: "Input-Standorte für Isochronen-Berechnung als Point-Features", type: "layer", layertype:'Point', text:"Layer:"},
        {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,3600,100], text:"check?"},
        {name: "count", title: "Intervalle", info: "Anzahl an Intervallen", type: "range", values: [1,10,1], text:"check?"},
        {name: "profile", title: "Profile", info: "Zu verwendendes Routing-Profile/Routing-Graphen", type: "select", values: ['driving-car'], text:"Profile"},
        {name: "smoothing", title: "Smoothing", info: "Smoothing-Faktor zur Isochronen-Berechnung (je höher desto stärker vereinfacht, je niedriger desto mehr Details)", type: "range", values: [1,10,0.1]},
        {name: "travelmode", title: "Travel Mode", info: "Gibt Einheit der Reichweiten an (time=[s], distance=[m])", type: "multiselect", values: ['time', 'distance', 'test', 'more_test', 'many_test'], text:"Travel-Mode"},
        {name: "locationtype", title: "Location Type", info: "Gibt an ob Routing an locations starten (Routing vorwärts) oder enden (Routing rückwärts) soll", type: "select", values: ['start', 'destination'], text:"Location-Type"},
        {name: "outputtype", title: "Output Type", info: "Gibt an ob Polygone vollständig oder als Ringe (kleinere Polygone von größeren abgezogen) zurückgegeben werden sollen", type: "check", values: ['polygon ring', 'full polygon'], text:'Output-Type'},
    ]
    out = [
    ]

    getToolName(): string {
        return this.name;
    }
    getParameterInfo(): object[] {
        return this.param;
    }
    getOutputInfo(): object[] {
        return this.out;
    }
    getDefaultParameters(): object {
        return {
            range: 90,
            test: ['1','200','1000'],
            url: "http://localhost:8080/v1",
            outputtype: false,
        };
    }
    updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object] {
        if (changed === "url") {
            param["url"] = "http://localhost:8080/v1";
        }
        return [null, param];
    }
    
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