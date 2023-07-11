import { getAppState, getToolbarState } from '/state';
import { ITool } from "./ITool";

const toolbar = getToolbarState();
const state = getAppState();

class ToolManager
{
    toolboxes: Map<string, Map<string, ITool>>;

    constructor() 
    {
        this.toolboxes = new Map<string, Map<string, ITool>>();
    }

    loadTools(tools: ITool[], group_name: string) {
        const toolbox = new Map<string, ITool>();
        const toollist = [];
        for (let t of tools)
        {
            toolbox.set(t.getToolName(), t);
            toollist.push(t.getToolName());
        }
        this.toolboxes.set(group_name, toolbox);
        toolbar.tools[group_name] = toollist;
    }
    
    getTool(toolbox: string, tool: string) : ITool {
        const tbx = this.toolboxes.get(toolbox);
        if (tbx === undefined) {
            return undefined;
        }
        return tbx.get(tool);
    }

    addMessage(message, color="black") {
        if (typeof message === 'string')
        { message = message.replace(/(?:\r\n|\r|\n)/g, '<br>'); }
        toolbar.toolinfo.text += "<span style='color:" + color + "'>" + message + "</span><br>";
    }

    setToolInfo() {
        state.infobar.active = "ToolInfo";       
    }

    async runTool(toolbox: string, tool: string, params) {
        console.log(params);
        const Tool = this.getTool(toolbox, tool);
        toolbar.currtool.toolbox = toolbox;
        toolbar.currtool.tool = tool;
        toolbar.currtool.state = 'running';
        toolbar.currtool.params = params;
        toolbar.toolinfo.text = "";
        const out = {};
        this.addMessage("Started " + tool + ":", 'green');
        try {
            let start = new Date().getTime();
            await Tool.run(params, out, (message) => this.addMessage(message));
            let end = new Date().getTime();
            let time = end - start;
            this.addMessage("Succesfully finished in " + time + " ms", 'green');
            toolbar.currtool.state = 'finished';
            return out;
        }
        catch (e) {
            this.addMessage(e, 'red');
            toolbar.currtool.state = 'error';
        }
    }
}

const TOOLMANAGER = new ToolManager();

function getToolManager() {
    return TOOLMANAGER;
}

export { getToolManager }