<template>
    <main>
        <div class="container mb-1">
            <div class="row card tree-supply">
                <div class="col card-body">
                    <h5>Supply database with nodes</h5>
                    <div class="d-inline-flex">
                        <label class="mt-2 mr-1 ml-1" for="quantity">Quantity</label>
                        <input class="m-1" type="text" id="quantity" min="1" placeholder="set number of nodes" />
                        <button class="m-1 card btn tree-supply-button" type="button" @click="supplyRandomInBackend()">
                            Supply (backend)
                        </button>
                        <button class="m-1 card btn tree-shuffle-button" type="button" @click="shuffleParentsInBackend()">
                            Shuffle parents (backend)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
function supplyRandomInBackend() {}
function shuffleParentsInBackend() {}
</script>