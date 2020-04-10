<template>
    <div class="greeting">
        <div>{{ greeting }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Greeting extends Vue {
    private greetings: { [key: string]: string } = {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening",
        night: "Go to Bed",
        error: "Error"
    };
    greeting = "Loading";

    created() {
        this.currentGreeting();
        setInterval(this.currentGreeting, 60000);
    }

    currentGreeting() {
        const hour: number = new Date().getHours();
        let greetingType = "error";
        if (hour < 5 || hour >= 22) {
            greetingType = "night";
        } else if (hour < 12) {
            greetingType = "morning";
        } else if (hour < 17) {
            greetingType = "afternoon";
        } else if (hour < 22) {
            greetingType = "evening";
        }
        this.greeting = this.greetings[greetingType] + " Aman";
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.greeting {
    font-size: 1rem;
    justify-self: center;
    align-self: start;
}
</style>
