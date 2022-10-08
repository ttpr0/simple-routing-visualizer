import { tool as multigraph } from "./MultiGraph"
import { tool as routing } from "./Routing"

const toolbox = {
    name: "RoutingTools",
    tools: [
        multigraph,
        routing
    ]
}

export { toolbox }