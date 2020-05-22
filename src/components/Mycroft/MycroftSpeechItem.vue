<template>
    <transition-group name="slide-fade" mode="out-in">
        <div
            id="recent-utterances"
            class="speech-item"
            v-for="utterance in utterances.slice().reverse()"
            :key="utterance.id"
            :class="utterance.type"
        >
            {{ utterance.text }}
        </div>
    </transition-group>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export type InteractionItem = {
    id: number;
    type: "response" | "utterance";
    text: string;
};

@Component
export default class MycroftSpeechItem extends Vue {
    @Prop()
    utterances!: Array<InteractionItem>;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease;
}
.slide-fade-leave-active {
    transition: all 2s ease;
}
.slide-fade-enter {
    transform: translateY(-20px);
    opacity: 0;
}
.slide-fade-leave-to {
    transform: translateY(100px);
    opacity: 0;
}
.response {
    font-size: 4rem;
}
.utterance {
    font-size: 2rem;
}
.speech-item {
    text-align: center;
}
</style>
