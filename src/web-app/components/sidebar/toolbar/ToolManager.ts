import { getAppState, getToolbarState } from '/state';
import { ITool } from "./ITool";

const toolbar = getToolbarState();
const state = getAppState();

class ToolManager
{
    tools: Map<string, ITool>;

    constructor() 
    {
        this.tools = new Map<string, ITool>();
    }

    loadTools(tools: ITool[], group_name: string) {
        for (let t of tools)
        {
            let toolname = t.name + "  (" + group_name + ")";
            this.tools.set(toolname, t);
            toolbar.tools.push(toolname);
        }
    }
    
    getTool(toolname: string) : ITool {
        return this.tools.get(toolname);
    }

    addMessage(message, color="black") {
        if (typeof message === 'string')
        { message = message.replace(/(?:\r\n|\r|\n)/g, '<br>'); }
        toolbar.toolinfo.text += "<span style='color:" + color + "'>" + message + "</span><br>";
    }

    setToolInfo() {
        state.window.show = true; 
        state.window.pos = [400, 400];
        state.window.name = "Tool-Info";
        state.window.type = "toolinfo"         
    }

    async runTool(tool: string, params) {
        const Tool = this.tools.get(tool);
        toolbar.state = 'running';
        toolbar.toolinfo.text = "";
        const out = {};
        this.addMessage("Started " + tool + ":", 'green');
        try {
            await Tool.run(params, out, (message) => this.addMessage(message));
            this.addMessage("Succesfully finished", 'green');
            toolbar.state = 'finished';
            return out;
        }
        catch (e) {
            this.addMessage(e, 'red');
            toolbar.state = 'error';
        }
    }
}

const TOOLMANAGER = new ToolManager();

function getToolManager() {
    return TOOLMANAGER;
}

export { getToolManager }