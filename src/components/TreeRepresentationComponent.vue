<template>
    <div :id="treeId" class="container" :csrf="csrf">
        <div :id="editNodeId" :class="hiddenClass">
            <input type="text" :id="editNodeInputId" @blur="onBlurEditNode" @keypress="onEditEnter" />
        </div>
        <div :id="addNodeId" :class="hiddenClass">
            <input type="text" :id="addNodeInputId" @blur="onBlurAddNode" @keypress="onAddEnter" />
        </div>
        <div class="card tree-background col">
            <div id="node-0" class="node" @dragover="allowDropNode" @drop="dropNode" @dragstart="dragNode">
                <div :id="`node-0-header`" class="node-header">
                    <div :id="`node-0-controls`" class="node-controls">
                        <div :id="`node-0-controls-fold`" class="node-controls-fold" @click="foldNode">
                            &#9660;
                        </div>
                        <div :id="`node-0-controls-add-child`" class="node-controls-add-child mouseover-node-button"
                            @click="addNode">
                            &#10010;
                        </div>
                        <div :id="`node-0-controls-remove`" class="node-controls-remove hidden mouseover-node-button"
                            @click="removeNodeTree">
                            &#10060;
                        </div>
                        <div :id="`node-0-controls-sort-asc`" class="node-controls-sort-asc mouseover-node-button"
                            @click="sortChildNodesAsc">
                            &#8599;
                        </div>
                        <div :id="`node-0-controls-sort-desc`" class="node-controls-sort-desc mouseover-node-button"
                            @click="sortChildNodesDesc">
                            &#8600;
                        </div>
                    </div>
                    <div :id="`node-0-content`" :class="`node-content ${hiddenClass}`">
                        root of the tree
                    </div>
                </div>
                <div v-for="row in nodes" v-bind:key="row.id" :id="`node-${row.id}`" :parent="row.parentId" class="node"
                    draggable="true" @mouseover="mouseOverNode" @mouseout="mouseOutNode" @dragover="allowDropNode"
                    @drop="dropNode" @dragstart="dragNode">
                    <div :id="`node-${row.id}-header`" class="node-header">
                        <div :id="`node-${row.id}-controls`" class="node-controls">
                            <div :id="`node-${row.id}-controls-fold`" class="node-controls-fold" @click="foldNode">
                                &#9660;
                            </div>
                            <div :id="`node-${row.id}-controls-add-child`"
                                class="node-controls-add-child mouseover-node-button" @click="addNode">
                                &#10010;
                            </div>
                            <div :id="`node-${row.id}-controls-remove`" class="node-controls-remove mouseover-node-button"
                                @click="removeNodeTree">
                                &#10060;
                            </div>
                            <div :id="`node-${row.id}-controls-sort-asc`"
                                class="node-controls-sort-asc mouseover-node-button" @click="sortChildNodesAsc">
                                &#8599;
                            </div>
                            <div :id="`node-${row.id}-controls-sort-desc`"
                                class="node-controls-sort-desc mouseover-node-button" @click="sortChildNodesDesc">
                                &#8600;
                            </div>
                        </div>
                        <div :id="`node-${row.id}-content`" class="node-content" @click="editNode">
                            {{ row.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { TreeNodeApi } from '@/apis/TreeNodeApi';
import { defineComponent } from 'vue';
import axios from 'axios';

type Row = {
    id: string,
    name: string,
    parentId: string | null,
    created_at: string,
    updated_at: string,
}

type TreeRepresentationComponent = {
    treeId: string,
    nodeFoldClass: string,
    addNodeId: string,
    addNodeInputId: string,
    editNodeId: string,
    editNodeInputId: string,
    hiddenClass: string,
    nodes: Row[],
    row: Row
};

export default defineComponent({
    props: { csrf: String },
    /**
     * Data structure
     */
    data(): TreeRepresentationComponent {
        return {
            treeId: "tree",
            nodeFoldClass: "node-fold",
            addNodeId: "add-node",
            addNodeInputId: "add-node-input",
            editNodeId: "edit-node",
            editNodeInputId: "edit-node-input",
            hiddenClass: "hidden",
            nodes: [],
            row: {
                id: "",
                name: "",
                parentId: null,
                created_at: "",
                updated_at: "",
            },
        };
    },
    created() {
        this.fetchNodes();
    },
    updated() {
        this.buildTree();
    },

    /**
     * Methods
     */
    methods: {
        /**
         * Statement of not included target to mouseover
         */
        excludeMouseOver(event: Event) {
            const id: string = (event.target as HTMLElement).id ?? "";
            const classList: DOMTokenList = (event.target as HTMLElement).classList;
            return (
                id === this.editNodeId ||
                id === this.editNodeInputId ||
                id === this.addNodeId ||
                id === this.addNodeInputId ||
                classList.contains("node-controls")
            );
        },
        /**
         * This method defines how to compare nodes for sorting
         */
        compareNodes(node1: HTMLElement, node2: HTMLElement) {
            if (node1.classList === null || node2.classList === null) {
                return 0;
            }
            if (
                node1.classList.contains("node-header") ||
                node2.classList.contains("node-header")
            ) {
                return 0;
            } else {
                return (node1?.firstChild?.lastChild as HTMLElement).innerHTML.localeCompare(
                    (node2?.firstChild?.lastChild as HTMLElement).innerHTML
                );
            }
        },
        /**
         * This method puts back edit node input to the root
         */
        backToRootEditNode() {
            const editNode: HTMLElement | null = document.getElementById(this.editNodeId);
            const tree: HTMLElement | null = document.getElementById(this.treeId);
            if (!!editNode) {
                editNode.parentNode?.removeChild(editNode);
                tree?.insertBefore(editNode, tree.childNodes[0]);
            }
        },
        /**
         * This method puts back add node input to the root
         */
        backToRootAddNode() {
            const addNode: HTMLElement | null = document.getElementById(this.addNodeId);
            const tree: HTMLElement | null = document.getElementById(this.treeId);
            if (!!addNode) {
                addNode.parentNode?.removeChild(addNode);
                tree?.insertBefore(addNode, tree.childNodes[0]);
            }
        },
        /**
         * Hides edit node input field
         */
        hideEditNode() {
            const editNode: HTMLElement | null = document.getElementById(this.editNodeId);
            editNode?.classList.add(this.hiddenClass);
        },
        /**
         * Hides add node input field
         */
        hideAddNode() {
            const addNode: HTMLElement | null = document.getElementById(this.addNodeId);
            addNode?.classList.add(this.hiddenClass);
        },
        /**
         * Event listeners
         */
        /**
         * Sorting nodes ascending order
         */
        sortChildNodesAsc: function (event: Event) {
            // @click="sortChildNodesAsc"
            // console.log("ASC event target");
            // console.log(event.target);
            // console.log("ASC node subnode collection");
            // arr < controls < header < node
            const target = event.target as HTMLElement;
            const ancestor = target?.parentNode?.parentNode?.parentNode;
            const childArr = ancestor?.childNodes;
            // console.log("ancestor");
            // console.log(ancestor);
            // console.log(childArr);
            const nodesArr = [].slice.call(childArr).sort(this.compareNodes);
            nodesArr.splice(0, 1);
            // console.log("sorted nodes");
            // console.log(nodesArr);
            nodesArr.forEach(function (node) {
                ancestor?.appendChild(node);
            });
        },
        /**
         * Sorting nodes descending order
         */
        sortChildNodesDesc: function (event: Event) {
            // @click="sortChildNodesDesc"
            // console.log("DESC event target");
            // console.log(event.target);
            // console.log("DESC node subnode collection");
            // arr < controls < header < node
            const target = event.target as HTMLElement;
            const ancestor = target?.parentNode?.parentNode?.parentNode;
            const childArr = ancestor?.childNodes;
            // console.log(childArr);
            const nodesArr = [].slice.call(childArr).sort(this.compareNodes);
            nodesArr.splice(0, 1);
            nodesArr.reverse();
            // console.log("sorted nodes");
            // console.log(nodesArr);
            nodesArr.forEach(function (node) {
                ancestor?.appendChild(node);
            });
        },

        /**
         * Defines action for allowing drop to node
         */
        allowDropNode: function (event: Event) {
            // @dragover="allowDropNode"
            event.preventDefault();
        },
        /**
         * Action defining dropping to node
         */
        dropNode: function (event: DragEvent) {
            // @drop="dropNode"
            event.preventDefault();
            const target = event.target as HTMLElement;
            const data = event?.dataTransfer?.getData("moved");
            let newParent: HTMLElement | null = null;
            // console.log("data moved:"); // DEBUG
            // console.log(data); // DEBUG
            // console.log("event target:"); // DEBUG
            // console.log(event.target); // DEBUG
            if (target.classList.contains("node-header")) {
                newParent = target.parentNode as HTMLElement;
            } else if ((target?.parentNode as HTMLElement).classList.contains("node-header")) {
                // controls, content
                newParent = target.parentNode?.parentNode as HTMLElement;
            } else if (
                (target.parentNode?.parentNode as HTMLElement).classList.contains("node-header")
            ) {
                // single control field
                newParent = target?.parentNode?.parentNode?.parentNode as HTMLElement;
            } else {
                newParent = target;
            }
            if (newParent != null) {
                const newTarget: HTMLElement | null = document.getElementById(data ?? "");
                axios
                    .put(`${TreeNodeApi.base}/${data?.split("-")[1]}`, {
                        parentId: newParent.id.split("-")[1],
                    })
                    .then((response) => {
                        // console.log("update response");
                        // console.log(response);
                        if (!!newTarget) {
                            newParent?.appendChild(newTarget);
                        }
                    });
            }
        },
        /**
         * Action defining draging node up
         */
        dragNode: function (event: DragEvent) {
            // @dragstart="dragNode"
            event?.dataTransfer?.setData("moved", (event.target as HTMLElement).id);
        },
        /**
         * Action defines folding of nodes
         */
        foldNode: function (event: Event) {
            // V < controls < header < node
            const node = (event.target as HTMLElement)?.parentNode?.parentNode?.parentNode as HTMLElement;
            if (node.classList.contains(this.nodeFoldClass)) {
                node.classList.remove(this.nodeFoldClass);
            } else {
                node.classList.add(this.nodeFoldClass);
            }
            // console.log(node); // DEBUG
        },
        /**
         * Action defining showing edit node input over exact place
         */
        showEditNode: function (event: Event) {
            const editNode: HTMLElement | null = document.getElementById(this.editNodeId);
            const target: HTMLElement | null = event.target as HTMLElement;
            if (!!editNode && !!editNode.firstChild) {
                (editNode.firstChild as HTMLInputElement).value = target?.innerText;
                // console.log(editNode.id, editNode.parentNode.id); // DEBUG
                // content < header < node
                target?.parentNode?.parentNode?.insertBefore(
                    editNode,
                    // content < header
                    target.parentNode
                );
                editNode.classList.remove(this.hiddenClass);
            }
        },
        /**
         * Action defining showing add node input over exact place
         */
        showAddNode: function (event: Event) {
            const addNode: HTMLElement | null = document.getElementById(this.addNodeId);
            const target: HTMLElement | null = event.target as HTMLElement;
            if (!!addNode) {
                (addNode?.firstChild as HTMLInputElement).value = "";
                // console.log("showAddNode"); // DEBUG
                // console.log(addNode.id, addNode.parentNode.id); // DEBUG
                // + < controls < header < node
                target?.parentNode?.parentNode?.parentNode?.insertBefore(
                    addNode,
                    // + < controls < header
                    target.parentNode.parentNode
                );
                addNode.classList.remove(this.hiddenClass);
            }
        },
        /**
         * Action defining toggle edit node input
         */
        toggleEditNode: function (event: Event) {
            const editNode = document.getElementById(this.editNodeId);
            const tree = document.getElementById(this.treeId);
            const target = event.target as HTMLElement;
            if (!!tree && !!editNode) {
                if (editNode?.classList.contains(this.hiddenClass)) {
                    editNode?.parentNode?.removeChild(editNode);
                    target?.parentNode?.insertBefore(editNode, target);
                    editNode.classList.remove(this.hiddenClass);
                } else {
                    editNode?.classList.add(this.hiddenClass);
                    editNode?.parentNode?.removeChild(editNode);
                    tree.insertBefore(editNode, tree.childNodes[0]);
                }
            }
        },
        /**
         * Action storing node to DB over API
         * after successful API transfer builds frontend tree
         */
        storeNode: function ({ lastIndex = "", newName = "", newParent = "" }) {
            let node = {
                name: newName,
                parentId: newParent,
            };
            if (newName != null && newParent != null && lastIndex != null) {
                // console.log(`Store node: ${node} response:`);
                axios.post(TreeNodeApi.base, node).then((response) => {
                    // console.log(response); // DEBUG
                    this.fetchNodes();
                    this.buildTree();
                });
            }
        },
        /**
         * Action updating node in DB over API
         */
        updateNode: async function (target: HTMLElement, { newName = "", newParent = "" }) {
            const parentId: string | null = (target?.parentNode as HTMLElement)?.getAttribute("parent");
            let node: { id: number, parentId: number | null, name: string } = {
                id: parseInt(target.id.split("-")[1]),
                parentId: !!parentId ? parseInt(parentId) : null,
                name: target.innerText,
            };
            // console.log(`new name: ${newName}, new parent: ${newParent}`); // DEBUG
            // console.log(
            // `update full_id:${target.id}, id:${node.id}, parentId:${node.parentId}, content:${node.name}`
            // ); // DEBUG
            node.name = newName !== "" ? newName : node.name;
            node.parentId = newParent !== "" ? parseInt(newParent) : node.parentId;
            target.innerHTML = node.name;
            target.setAttribute("parent", `${node.parentId}`);
            console.log({
                name: node.name,
                parentId: node.parentId,
            })
            await axios.patch(`${TreeNodeApi.base}/${node.id}`, {
                name: node.name,
                parentId: node.parentId,
            });
        },
        /**
         * Action defining removing node tree or single node over API
         * after successful call removes node from DOM
         */
        removeNodeTree: function (event: Event) {
            // api/customnodes/deletetree/{node}
            const target = event.target as HTMLElement;
            const nodeToRemove = target?.parentNode?.parentNode?.parentNode;
            const parentOfRemoved = nodeToRemove?.parentNode;
            const id = (nodeToRemove as HTMLElement).id.split("-")[1];
            axios
                .delete(`${TreeNodeApi.deleteTree}/${id}`)
                .then((response) => {
                    // console.log(response);
                    if (!!nodeToRemove) {
                        parentOfRemoved?.removeChild(nodeToRemove);
                    }
                });
            // - < controls < header < node
            // // console.log(); // DEBUG
        },
        /**
         * Action defining adding node
         */
        addNode: function (event: Event) {
            const target: HTMLElement = event.target as HTMLElement;
            axios.get(TreeNodeApi.lastElementIndex).then((response) => {
                let localData = response.data;
                // console.log(`Last index is: ${localData["last_index"]}`); // DEBUG
                let addNodeInput = document.getElementById(this.addNodeInputId);
                let newParent = (target?.parentNode?.parentNode?.parentNode as HTMLElement)?.id.split(
                    "-"
                )[1];
                addNodeInput?.setAttribute("last_index", localData["last_index"]);
                addNodeInput?.setAttribute("future_parent_id", newParent);
            });
            this.showAddNode(event);
            // console.log("parent of addNode"); // DEBUG
            // console.log(event.target.parentNode.parentNode.parentNode); // DEBUG
        },
        /**
         * Action defines hiding edit node input on blur event
         */
        onBlurEditNode: function (event: Event) {
            // console.log(`You blured from ${event.target.id}`); // DEBUG
            this.hideEditNode();
        },
        /**
         * Action defines hiding add node input on blur event
         */
        onBlurAddNode: function (event: Event) {
            // console.log(`You blured from ${event.target.id}`); // DEBUG
            this.hideAddNode();
        },
        /**
         * Action defining what happens after clicking ENTER or ESC on edited input
         */
        onEditEnter: async function (event: KeyboardEvent) {
            // // console.log(`You clicked ${event.keyCode} ${event.target.text}`);
            const target: HTMLElement | null = event.target as HTMLElement;
            if (event.keyCode === 13 || event.keyCode === 27) {
                event.preventDefault();
                target.blur();
                const newTargetId = await (target?.parentNode?.nextSibling?.lastChild as HTMLElement).id;
                const newTarget = document.getElementById(newTargetId);
                // console.log(`new target id: ${newTargetId}, new target:`); // DEBUG
                // console.log(newTarget); // DEBUG
                // console.log(`target value: ${event.target.value}`); // DEBUG
                if (!!newTarget) {
                    this.updateNode(newTarget, { newName: (target as HTMLInputElement).value });
                }
                this.onBlurEditNode(event);
                this.backToRootEditNode();
            }
        },
        /**
         * Action defining what happens after clicking ENTER or ESC on add input
         */
        onAddEnter: async function (event: KeyboardEvent) {
            // // console.log(`You clicked ${event.keyCode} ${event.target.text}`); // DEBUG
            const target: HTMLElement | null = event.target as HTMLElement;
            if (event.keyCode === 13 || event.keyCode === 27) {
                event.preventDefault();
                target.blur();
                let node: { lastIndex: string | undefined, newName: string | undefined, newParent: string | undefined } = {
                    lastIndex: target.getAttribute("last_index") ?? "",
                    newName: (target as HTMLInputElement).value,
                    newParent: target.getAttribute("future_parent_id") ?? "",
                };
                this.storeNode(node);
                this.onBlurAddNode(event);
                this.backToRootAddNode();
            }
        },
        /**
         * Action defining editing node
         */
        editNode: function (event: Event) {
            event.stopPropagation();
            this.showEditNode(event);
        },

        /**
         * Action defining on mouseover changing states
         */
        mouseOverNode: function (event: Event) {
            if (!this.excludeMouseOver(event)) {
                (event.target as HTMLElement)?.classList.add("mouseover-node");
            }
        },
        /**
         * Action defining on mouseouf changing states
         */
        mouseOutNode: function (event: Event) {
            if (!this.excludeMouseOver(event)) {
                (event.target as HTMLElement)?.classList.remove("mouseover-node");
            }
        },
        /**
         * Tree building methods
         */
        /**
         * Fetching nodes over API from DB
         */
        async fetchNodes() {
            // console.log(`before fetch ${this.nodes}`); // DEBUG
            let res = await axios.get(TreeNodeApi.base);
            this.nodes = await res.data;
            // console.log(`after fetch ${this.nodes}`); // DEBUG
        },
        /**
         * Actual building tree in front end, because DB representation
         * of Tree is linear.
         */
        buildTree() {
            const n = document.getElementsByClassName("node");
            // console.log(n); // DEBUG
            let i = 0,
                size = n.length - 1,
                correct = 0;
            while (correct < size) {
                if (n[i].hasAttribute("parent")) {
                    const parent = n[i].getAttribute("parent");
                    const parentId = `node-${parent}`;
                    const ancestor = document.getElementById(parentId);
                    if (ancestor != null) {
                        if ((n[i]?.parentNode as HTMLElement)?.id == parentId) {
                            correct++;
                        } else {
                            correct--;
                            let tmp = n[i];
                            tmp.parentNode?.removeChild(tmp);
                            // console.log(i, n.length, tmp.id, tmp.getAttribute("parent")); // DEBUG
                            try {
                                ancestor.appendChild(tmp);
                            } catch (error) {
                                // console.log(
                                // "This error is caused by random generated shuffling. It's not possible to generate node in such way adding it normally.",
                                // error,
                                // `ancestor: ${ancestor.id}, child: ${tmp.id}`
                                // ); // DEBUG
                            }
                        }
                    }
                }
                i++;
                i %= n.length;
            }
        },
    },
});
</script>