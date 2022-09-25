

interface ITool
{
    name: string;
    param: object[];
    out: object[];
    
    getParameterInfo() : Array<object>;

    getOutputInfo() : Array<object>;

    run(param, out, addMessage) : Promise<void>;
}

export { ITool }