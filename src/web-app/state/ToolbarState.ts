
class ToolbarState
{
    toolinfo = {
        tool: "",
        text: "",
    }
    tools = []
    currtool = {
        name: undefined,
        params: {}
    }
    state = null
    running = ""
}

export { ToolbarState }