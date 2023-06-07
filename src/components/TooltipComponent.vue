<script setup lang="ts"></script>
<template>
    <div class="container mb-1">
        <div class="row card tree-tooltip">
            <div class="col card-body">
                <h5>Tooltip</h5>
                <div class="tooltip-node">
                    <div class="node-header">
                        <div :id="`node-0-controls`" class="node-controls d-inline-flex align-content-center">
                            <div :id="`node-0-controls-fold`" class="node-controls-fold">
                                &#9660;
                            </div>
                            <div class="tooltip-description">
                                this button collapses the entire tree level
                            </div>
                            <div :id="`node-0-controls-add-child`"
                                class="node-controls-add-child mouseover-node-button border-0">
                                &#10010;
                            </div>
                            <div class="tooltip-description">
                                this button adds a&nbsp;new child node
                            </div>
                            <div :id="`node-0-controls-remove`" class="node-controls-remove mouseover-node-button border-0">
                                &#10060;
                            </div>
                            <div class="tooltip-description">
                                this button deletes an&nbsp;entire branch of&nbsp;the&nbsp;tree or&nbsp;a&nbsp;single item
                            </div>
                            <div :id="`node-0-controls-sort-asc`"
                                class="node-controls-sort-asc mouseover-node-button border-0">
                                &#8599;
                            </div>
                            <div class="tooltip-description">
                                this button sorts the&nbsp;descendants of the&nbsp;node in&nbsp;ascending order
                            </div>
                            <div :id="`node-0-controls-sort-desc`"
                                class="node-controls-sort-desc mouseover-node-button border-0">
                                &#8600;
                            </div>
                            <div class="tooltip-description">
                                this button sorts the&nbsp;descendants of the&nbsp;node in&nbsp;descending order
                            </div>
                        </div>
                    </div>
                    <div class="tooltip-description">
                        <h4>
                            Moving elements of the tree is done by grabbing a given node and moving it to another place
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>