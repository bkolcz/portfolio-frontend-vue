export const TreeNodeApi = {
    root: import.meta.env.VITE_TREE_NODE_API,
    routes: {
        base: "/tree-nodes",
        get deleteTree(): string { return this.base + "/delete-tree"; },
        get shuffle(): string { return this.base + "/shuffle"; },
        get supply(): string { return this.base + "/supply"; },
        get lastElementItem(): string { return this.base + "/last-element/item"; }
    },
    get base(): string { return `${this.root}${this.routes.base}`; },
    get deleteTree(): string { return `${this.root}${this.routes.deleteTree}`; },
    get shuffle(): string { return `${this.root}${this.routes.shuffle}`; },
    get supply(): string { return `${this.root}${this.routes.supply}`; },
    get lastElementItem(): string { return `${this.root}${this.routes.lastElementItem}`; }
};