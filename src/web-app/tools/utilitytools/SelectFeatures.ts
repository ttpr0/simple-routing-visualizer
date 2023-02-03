import { initCustomFormatter } from "vue";
import { ITool } from "/components/sidebar/toolbar/ITool";
import { getMap } from '/map';

const map = getMap();

class SelectFeatures implements ITool
{
    name: string = "Select Features";
    param_info = [
        {name: "layer", title: "Layer", info: "layer to select features from", type: "layer", layertype:'any', text:"Layer:"},
        {name: "overwrite", title: "overwrite prevous", info: "overwrite previous selection", type: "check", values: true, text:'Overwrite'},
    ]
    out_info = [
    ]

    getToolName(): string {
        return this.name;
    }
    getParameterInfo(): object[] {
        return this.param_info;
    }
    getOutputInfo(): object[] {
        return this.out_info;
    }
    getDefaultParameters(): object {
        return {
            layer: "",
            attribute: "",
            overwrite: true,
        };
    }
    updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object] {
        if (changed === "layer") {
            const layer = map.getLayerByName(param["layer"]);
            if (layer === undefined) {
                return [this.param_info, this.getDefaultParameters()];
            }
            const values = [];
            const feature = layer.getFeature(0);
            for (let attr in feature.properties) {
                values.push(attr);
            }
            param["attribute"] = "";
            let index = param_info.findIndex(item => item["name"] === "attribute");
            let prop_param = null;
            if (index === -1) {
                prop_param = {name: "attribute", title: "Attribute", info: "layer attribute", type: "select", values: values, text:"Attribute"};
                return [[...this.param_info, prop_param], param];
            }
            else {
                param_info[index]["values"] = values;
                return [param_info, param];
            }
        }
        if (changed === "attribute") {
            const layer = map.getLayerByName(param["layer"]);
            const prop = layer.getProperty(0, param["attribute"]);
            if (typeof prop === "string") {
                const values = new Set();
                for (let id of layer.getAllFeatures()) {
                    values.add(layer.getProperty(id, param["attribute"]))
                }
                param["value"] = "";
                param["type"] = "equal";
                const prop_param = {name: "value", title: "Selection Value", info: "feature with this value will be selected", type: "select", values: Array.from(values), text:"Value"};
                param_info = param_info.filter(item => ["layer", "attribute", "overwrite"].includes(item["name"]));
                param_info.push(prop_param);
                return [param_info, param];
            }
            if (typeof prop === "number") {
                let max_value = -Infinity;
                let min_value = Infinity;
                for (let id of layer.getAllFeatures()) {
                    const prop = layer.getProperty(id, param["attribute"]);
                    if (min_value > prop)
                        min_value = prop;
                    if (max_value < prop)
                        max_value = prop;
                }
                let range_value = (max_value - min_value) / 100;
                param["value"] = "";
                param["type"] = "";
                const range_prop = {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [min_value,max_value,range_value], text:"Range"};
                const type_prop = {name: "type", title: "Selection Type", info: "how features should be selected", type: "select", values: ["Less Than", "More Than"], text:"Type"};
                param_info = param_info.filter(item => ["layer", "attribute", "overwrite"].includes(item["name"]));
                param_info.push(range_prop);
                param_info.push(type_prop);
                return [param_info, param];
            }
        }
        return [null, param];
    }
    
    async run(param, out, addMessage) {
        const layer = map.getLayerByName(param["layer"]);
        const attribute = param["attribute"];
        const overwrite = param["overwrite"];
        let features = null;
        if (overwrite) {
            features = layer.getAllFeatures();
            layer.unselectAll();
        }
        else {
            features = layer.getSelectedFeatures();
        }
        if (param["type"] === "equal") {
            const value = param["value"];
            if (overwrite) {
                for (let id of features) {
                    if (value === layer.getProperty(id, attribute)) {
                        layer.selectFeature(id);
                    }
                }
            }
            else {
                for (let id of features) {
                    if (value !== layer.getProperty(id, attribute)) {
                        layer.unselectFeature(id);
                    }
                }
            }
        }
        if (param["type"] === "Less Than") {
            const value = param["range"];
            if (overwrite) {
                for (let id of features) {
                    if (layer.getProperty(id, attribute) < value) {
                        layer.selectFeature(id);
                    }
                }
            }
            else {
                for (let id of features) {
                    if (layer.getProperty(id, attribute) >= value) {
                        layer.unselectFeature(id);
                    }
                }
            }
        }
        if (param["type"] === "More Than") {
            const value = param["range"];
            if (overwrite) {
                for (let id of features) {
                    if (layer.getProperty(id, attribute) >= value) {
                        layer.selectFeature(id);
                    }
                }
            }
            else {
                for (let id of features) {
                    if (layer.getProperty(id, attribute) < value) {
                        layer.unselectFeature(id);
                    }
                }
            }
        }
    }
}

const tool = new SelectFeatures();

export { tool }