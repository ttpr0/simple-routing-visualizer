import { getAppState } from '/state';
import { IConnection } from './IConnection';

const state = getAppState();

let count = 0;

class ConnectionManager
{
    conns: Map<string, IConnection>;

    constructor()
    {
        this.conns = new Map<string, IConnection>();
    }

    async addConnection(conn: IConnection): Promise<boolean> {
        let suc = await conn.openConnection();
        if (suc) {
            const key = count.toString();
            count += 1;
            this.conns.set(key, conn);
            state.filetree.connections[key] = await conn.getTree();
        }
        return suc;
    }

    getConnection(key: string): IConnection {
        return this.conns.get(key);
    }

    async closeConnection(key: string): Promise<void> {
        const conn = this.getConnection(key);
        if (conn === undefined) {
            return;
        }
        await conn.closeConnection();
        delete state.filetree.connections[key];
    }

    async refreshConnection(key: string): Promise<void> {
        const conn = this.getConnection(key);
        if (conn === undefined) {
            return;
        }
        for (let item in state.filetree.connections) {
            if (item === key) {
                state.filetree.connections[item] = await conn.getTree();
            }
        }
    }
}

const CONNECTIONMANAGER = new ConnectionManager();

function getConnectionManager() {
    return CONNECTIONMANAGER;
}

export { getConnectionManager }