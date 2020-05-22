<template>
    <div class="leon">
        <div>Leon</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MycroftClient from "./../mycroft-client/mycroftClient";

@Component
export default class MyCroft extends Vue {
    lastMessage = "Placeholder Message";

    private client!: MycroftClient;

    created() {
        this.client = MycroftClient.getInstance();
    }

    private registerEventHandlers() {
        // TODO: Register mycroft UI events
    }

    // created() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
