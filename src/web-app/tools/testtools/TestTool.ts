import { ITool } from "/tools/ITool";
import { getMapState } from "/state";
import { VectorLayer } from "/map/VectorLayer";

const map = getMapState();

class Test<T>
{
    sub: T;
    test: any[];
    num: number = 1;

    getSub() : T {
        return this.sub;
    }
}

class Sub
{
    name: string = "test";

    getName()
    { return this.name; }
}

class TestTool implements ITool
{
    name: string = "Test";
    getParameterInfo(): object[] {
        throw new Error("Method not implemented.");
    }
    getOutputInfo(): object[] {
        throw new Error("Method not implemented.");
    }
    param = [
        {name: "layer", title: "Layer", info: "", type: "layer", layertype:'Point', text:"Layer:"},
    ]
    
    out = [
    ]
    
    async run(param, out, addMessage) {
        const layer: VectorLayer = map.getLayerByName(param.layer);
        if (layer == null || layer.type != "Point") {
            throw new Error("pls select a pointlayer!");
        }
        const feature = layer.getSource().getFeatures()[0]
        console.log(feature);
        let obj: object = {
            sub: new Sub(),
            test: []
        }
        let t = Object.assign(new Test<Sub>(), obj);
        test(t);
    }
}

function test(t: Test<Sub>)
{
    console.log(typeof t.getSub().getName());
}

const tool = new TestTool();

export { tool }