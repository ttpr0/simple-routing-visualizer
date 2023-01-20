
interface IConnection 
{
    openConnection(): Promise<boolean>;
    closeConnection(): Promise<void>;
    
    getTree(): Promise<any>;

    openFile(path: string): Promise<any>;
}

export { IConnection }