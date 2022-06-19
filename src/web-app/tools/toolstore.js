class ToolStore 
{
    tools;

    constructor() 
    {
        this.tools = {};
    }

    loadToolBox(toolbox) 
    {
        for (let t of toolbox.tools)
        {
            let toolname = t.name + "  (" + toolbox.name + ")";
            this.tools[toolname] = t.tool;
        }
    }
}

const toolstore = new ToolStore();

import { toolbox as orstoolbox } from "./toolboxes/ORSToolBox.jst";
//import { toolbox as testtoolbox } from "./toolboxes/TestToolBox.js";
toolstore.loadToolBox(orstoolbox);
//toolstore.loadToolBox(testtoolbox);

function getToolStore() {
    return toolstore;
}

export { getToolStore }