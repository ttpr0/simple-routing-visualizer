import { IConnection } from "./IConnection";
import { openDirectory, closeDirectory, getTree, openLayer } from '/util/fileapi'

class FileAPIConnection implements IConnection
{
    key: string;
    dir: string;
    tree: object;

    async openConnection(): Promise<boolean> {
        var resp = await openDirectory();
        this.key = resp.key;
        this.dir = resp.dir;
        return true;
    }
    async closeConnection(): Promise<void> {
        await closeDirectory(this.key);
        return;
    }

    async getTree(): Promise<any> {
        this.tree = await getTree(this.key + "/" + this.dir);
        return this.tree;
    }

    async openFile(path: string): Promise<any> {
        return await openLayer(this.key + path);
    }
}

export { FileAPIConnection }