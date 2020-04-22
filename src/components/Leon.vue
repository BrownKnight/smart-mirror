<template>
    <div class="leon">
        <div>Leon</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeonClient from "./../leon/leonClient";

@Component
export default class Leon extends Vue {
    lastMessage = "Placeholder Message";
    
    private leonClient: LeonClient;

    constructor() {
        super();
        this.leonClient = new LeonClient();

        // Add event handlers
        this.leonClient.registerEventHandler("recognized", this.handleRecognized.bind(this));
    }

    // created() {}

    // Leon Event Handlers
    handleRecognized(speechString: string) {
        this.lastMessage = speechString;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
