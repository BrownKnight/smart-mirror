<template>
    <div class="mycroft">
        <div>Mycroft</div>
        <MycroftSpeechItem v-bind:utterances="utterances" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MycroftClient, { GenericMessage } from "./../mycroft-client/mycroftClient";
import MycroftSpeechItem, { InteractionItem } from "./Mycroft/MycroftSpeechItem.vue";

@Component({
    components: { MycroftSpeechItem }
})
export default class MyCroft extends Vue {
    lastMessage = "Placeholder Message";
    utterances: Array<InteractionItem> = [];

    private client!: MycroftClient;

    created() {
        this.client = MycroftClient.getInstance();
        this.registerEventHandlers();
    }

    private registerEventHandlers() {
        // TODO: Register mycroft UI events
        this.client.onGenericMessage("recognizer_loop:utterance", this.recordUtterance.bind(this));
        this.client.onGenericMessage("speak", this.recordResponse.bind(this));
    }

    private recordUtterance(message: GenericMessage) {
        const id = Math.random() * 100000;
        (message.data.utterances as string[]).forEach(utterance =>
            this.utterances.push({ id: id, type: "utterance", text: utterance })
        );
        setTimeout(this.removeUtteranceById.bind(this), 5000, id);
    }

    private recordResponse(message: GenericMessage) {
        const id = Math.random() * 100000;
        this.utterances.push({ id: id, type: "response", text: message.data.utterance });
        setTimeout(this.removeUtteranceById.bind(this), 5000, id);
    }

    private removeUtteranceById(id: number) {
        this.utterances = this.utterances.filter(item => item.id != id);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
