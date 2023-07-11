
class ToolbarState
{
    tools = {}
    toolsearch = {
        opened: {},
        search: "",
    }
    toolview = {
        toolbox: undefined,
        tool: undefined,
        params: {},
    }

    toolinfo = {
        tool: "",
        text: "",
    }
    currtool = {
        toolbox: undefined,
        tool: undefined,
        params: {},
        state: null,
    }
}

export { ToolbarState }