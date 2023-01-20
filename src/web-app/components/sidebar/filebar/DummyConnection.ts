import { IConnection } from "./IConnection";

class DummyConnection implements IConnection
{
    async openConnection(): Promise<boolean> {
        return true;
    }
    async closeConnection(): Promise<void> {
        return;
    }

    async getTree(): Promise<any> {
        return {
            name: "project",
            type: "dir",
            children: [
                {
                    name: "test",
                    type: "dir",
                    children: [
                        {
                            name: "hospitals.geojson",
                            type: "vector",
                        }
                    ]
                },
                {
                    name: "file1",
                    type: "src",
                }
            ]
        };
    }

    async openFile(path: string): Promise<any> {
        return {};
    }
}

export { DummyConnection }