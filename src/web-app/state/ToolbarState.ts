
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
}

export { ToolbarState }