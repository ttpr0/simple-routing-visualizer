

interface ITool
{
    getToolName() : string;
    
    getParameterInfo() : Array<object>;

    getOutputInfo() : Array<object>;

    getDefaultParameters() : object;

    run(param, out, addMessage) : Promise<void>;
}

export { ITool }