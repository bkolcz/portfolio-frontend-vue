<template>
    <main>
        <div class="container mb-1">
            <div class="row card tree-supply">
                <div class="col card-body">
                    <h5>Supply database with nodes</h5>
                    <div class="d-inline-flex">
                        <label class="mt-2 mr-1 ml-1" for="quantity">Quantity</label>
                        <input class="m-1" type="number" id="quantity" v-model="fields.num" min="1" placeholder="set number of nodes" />
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

<script lang="ts">
import { TreeNodeApi } from '@/apis/TreeNodeApi';
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
    props: { csrf: String },
    data() {
        return {
            fields: {
                token: this.csrf,
                num: this.num,
            },
        };
    },
    mounted() {
        // console.log(`Component tree-loader mounted. ${this.csrf}`); // DEBUG console
    },
    methods: {
        /**
         * Number splitter to make numbers more readable
         */
        numberSplitter(number: number, separator: string = "-"): string {
            let newNumber: string = number
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
            // console.log(newNumber);
            return newNumber;
        },
        /**
         * Supply random nodes using frontend and making alot of calls to API
         */
        supplyRandom(): void {
            let numberOfItems: number = +this.fields.num;
            for (let i = 0; i < numberOfItems; i++) {
                let randomNumber = this.numberSplitter(
                    Math.floor(Math.random() * Date.now())
                );
                axios.post(TreeNodeApi.base, {
                    name: `generated-${randomNumber}`,
                    parentId: 0,
                });
            }
        },
        /**
         * Supply random nodes using one big payload from frontend
         */
        supplyRandomInBackend(): void {
            let numberOfItems: number = +this.fields.num;
            let payload = [];
            for (let i = 0; i < numberOfItems; i++) {
                let randomNumber = this.numberSplitter(
                    Math.floor(Math.random() * Date.now())
                );
                payload.push({
                    name: `generated-${randomNumber}`,
                    parentId: 0,
                });
            }
            axios.post(TreeNodeApi.supply, payload).then((response) => {
                location.reload();
            });
        },

        /**
         * Shuffles parents of nodes using frontend and making alot of calls to API
         */
        async shuffleParents(): Promise<void> {
            let incomeFields = (await axios.get(TreeNodeApi.base)).data;
            let idArray = [];
            if (incomeFields.length > 0) {
                // console.log(incomeFields); // DEBUG
                for (let i = 0; i < incomeFields.length; i++) {
                    idArray.push(incomeFields[i]["id"]);
                }
                // console.log(idArray); // DEBUG

                for (let i = 0; i < idArray.length; i++) {
                    let randomParent: number = Math.floor(Math.random() * idArray.length);
                    randomParent =
                        randomParent == idArray[i] ? idArray[i - 1] : randomParent;
                    //   // console.log(randomParent) // DEBUG

                    axios
                        .put(`${TreeNodeApi.base}/${idArray[i]}`, { parentId: randomParent })
                        .then((response) => {
                            location.reload();
                        });
                }
            }
        },
        /**
         * Shuffles parents of nodes using one big payload from frontend
         */
        async shuffleParentsInBackend(): Promise<void> {
            let incomeFields = (await axios.get(TreeNodeApi.base)).data;
            let idArray = [];
            let payload = [];
            if (incomeFields.length > 0) {
                // console.log(incomeFields); // DEBUG
                for (let i = 0; i < incomeFields.length; i++) {
                    idArray.push(incomeFields[i]["id"]);
                }
                // console.log(idArray); // DEBUG

                for (let i = 0; i < idArray.length; i++) {
                    let randomIndex = Math.floor(Math.random() * idArray.length);
                    let randomParent: number =
                        idArray[randomIndex] == idArray[i]
                            ? idArray[i - 1]
                            : idArray[randomIndex];
                    //   // console.log(randomParent) // DEBUG
                    payload.push({ id: idArray[i], parentId: randomParent });
                }
                axios.put(TreeNodeApi.shuffle, payload).then((response) => {
                    location.reload();
                });
                // console.log(`payload ${payload}`); // DEBUG
            }
        },
    },
});
</script>