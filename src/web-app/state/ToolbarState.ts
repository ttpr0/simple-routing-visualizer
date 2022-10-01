import { ToolStore } from "/tools/toolstore"
import { ITool } from "/tools/ITool";

const TOOLSTORE = new ToolStore();

class ToolbarState
{
    toolinfo = {
        tool: "",
        show: false,
        text: "",
        pos: [0,0]
    }
    tools = []
    currtool = {
        name: "",
        params: [],
        out: []
    }
    state = null
    running = ""

    loadTools(tools: ITool[], group_name: string) {
        for (let t of tools)
        {
            let toolname = t.name + "  (" + group_name + ")";
            TOOLSTORE.tools.set(toolname, t);
            this.tools.push(toolname);
        }
    }
    
    getTool(toolname: string) : ITool {
        return TOOLSTORE.tools.get(toolname);
    }

    addMessage(message, color="black") {
        if (typeof message === 'string')
        { message = message.replace(/(?:\r\n|\r|\n)/g, '<br>'); }
        this.toolinfo.text += "<span style='color:" + color + "'>" + message + "</span><br>";
    }

    setToolInfo() {
        this.toolinfo.show = true; 
        this.toolinfo.pos = [400, 400];          
    }

    async runTool(tool: string, params) {
        const Tool = TOOLSTORE.tools.get(tool);
        this.state = 'running';
        this.toolinfo.text = "";
        const out = {};
        this.addMessage("Started " + tool + ":", 'green');
        try {
            await Tool.run(params, out, (message) => this.addMessage(message));
            this.addMessage("Succesfully finished", 'green');
            this.state = 'finished';
            return out;
        }
        catch (e) {
            this.addMessage(e, 'red');
            this.state = 'error';
        }
    }
}

export { ToolbarState }