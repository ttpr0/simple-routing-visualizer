

interface ITool
{
    getToolName() : string;
    
    getParameterInfo() : Array<object>;

    updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object];

    getOutputInfo() : Array<object>;

    getDefaultParameters() : object;

    run(param, out, addMessage) : Promise<void>;
}

export { ITool }