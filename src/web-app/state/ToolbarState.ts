
class ToolbarState
{
    toolinfo = {
        tool: "",
        text: "",
    }
    tools = []
    currtool = {
        name: "",
        params: [],
        out: []
    }
    state = null
    running = ""
}

export { ToolbarState }