import { ITool } from "./ITool";

class ToolStore 
{
    tools: Map<string, ITool>;

    constructor() 
    {
        this.tools = new Map<string, ITool>();
    }

    loadTools(tools: ITool[], group_name: string) 
    {
        for (let t of tools)
        {
            let toolname = t.name + "  (" + group_name + ")";
            this.tools.set(toolname, t);
        }
    }
}

export { ToolStore }