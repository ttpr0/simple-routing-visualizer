

class QuadNode
{
    x: number;
    y: number;
    value: any;
    child1: QuadNode | null;
    child2: QuadNode | null;
    child3: QuadNode | null;
    child4: QuadNode | null;

    constructor(x: number, y: number, value: any)
    {
        this.x = x;
        this.y = y;
        this.value = value;
        this.child1 = null;
        this.child2 = null;
        this.child3 = null;
        this.child4 = null;
    }
}

class QuadTree
{
    root: QuadNode;

    constructor()
    {
        this.root = null;
    }

    get(x: number, y: number): any {
        for (let node of this.traverse(this.root)) {
            if (Math.abs(x-node.x)<0.00001 && Math.abs(y-node.y)<0.00001) {
                return node.value;
            }
        }
        return null;
    }

    get2(x: number, y: number): any 
    {
        let focus: QuadNode = this.root;
        if (focus === null) {
            return null;
        }
        while (true) {
            if ((x-focus.x)<0.1 && (y-focus.y)<0.1) {
                return focus.value;
            }
            if (x >= focus.x && y >= focus.y) {
                if (focus.child1 === null) {
                    break;
                }
                else {
                    focus = focus.child1;
                    continue;
                }
            }
            if (x < focus.x && y >= focus.y) {
                if (focus.child2 === null) {
                    break;
                }
                else {
                    focus = focus.child2;
                    continue;
                }
            }
            if (x < focus.x && y < focus.y) {
                if (focus.child3 === null) {
                    break;
                }
                else {
                    focus = focus.child3;
                    continue;
                }
            }
            if (x >= focus.x && y < focus.y) {
                if (focus.child4 === null) {
                    break;
                }
                else {
                    focus = focus.child4;
                    continue;
                }
            }
        }
        return null;
    }

    insert(x: number, y: number, value: any) 
    {
        if (this.root === null) {
            this.root = new QuadNode(x, y, value);
        }
        else {
            let focus: QuadNode = this.root;
            while (true) {
                if (x == focus.x && y == focus.y) {
                    focus.value = value;
                    break;
                }
                if (x >= focus.x && y >= focus.y) {
                    if (focus.child1 == null) {
                        focus.child1 = new QuadNode(x, y, value);
                        break;
                    }
                    else {
                        focus = focus.child1;
                        continue;
                    }
                }
                if (x < focus.x && y >= focus.y) {
                    if (focus.child2 == null) {
                        focus.child2 = new QuadNode(x, y, value);
                        break;
                    }
                    else {
                        focus = focus.child2;
                        continue;
                    }
                }
                if (x < focus.x && y < focus.y) {
                    if (focus.child3 == null) {
                        focus.child3 = new QuadNode(x, y, value);
                        break;
                    }
                    else {
                        focus = focus.child3;
                        continue;
                    }
                }
                if (x >= focus.x && y < focus.y) {
                    if (focus.child4 == null) {
                        focus.child4 = new QuadNode(x, y, value);
                        break;
                    }
                    else {
                        focus = focus.child4;
                        continue;
                    }
                }
            }
        }
    }

    remove(x: number, y: number) 
    {
        let focus: QuadNode = this.root;
        if (focus === null) {
            return;
        }
        while (true) {
            if (x == focus.child1.x && y == focus.child1.y) {
                focus.child1 = null;
            }
            if (x == focus.child2.x && y == focus.child2.y) {
                focus.child1 = null;
            }
            if (x == focus.child3.x && y == focus.child3.y) {
                focus.child1 = null;
            }
            if (x == focus.child4.x && y == focus.child4.y) {
                focus.child1 = null;
            }
            if (x >= focus.x && y >= focus.y) {
                if (focus.child1 == null) {
                    break;
                }
                else {
                    focus = focus.child1;
                    continue;
                }
            }
            if (x < focus.x && y >= focus.y) {
                if (focus.child2 == null) {
                    break;
                }
                else {
                    focus = focus.child2;
                    continue;
                }
            }
            if (x < focus.x && y < focus.y) {
                if (focus.child3 == null) {
                    break;
                }
                else {
                    focus = focus.child3;
                    continue;
                }
            }
            if (x >= focus.x && y < focus.y) {
                if (focus.child4 == null) {
                    break;
                }
                else {
                    focus = focus.child4;
                    continue;
                }
            }
        }
    }

    *getAllNodes(): IterableIterator<any> {
        yield* this.traverse(this.root);
    }

    private *traverse(node: QuadNode)
    {
        if (node !== null)
        {
            yield {x: node.x, y: node.y, value: node.value};
            yield* this.traverse(node.child1);
            yield* this.traverse(node.child2);
            yield* this.traverse(node.child3);
            yield* this.traverse(node.child4);
        }
    }
}

export { QuadTree };