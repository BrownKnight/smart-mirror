<template>
    <div class="time">
        <div>{{ time }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Time extends Vue {
    time = "fghfghfg";

    created() {
        setInterval(this.currentTime, 1000);
    }

    currentTime() {
        const date: Date = new Date();
        const hours = date
            .getHours()
            .toString()
            .padStart(2, "0");
        const minutes = date
            .getMinutes()
            .toString()
            .padStart(2, "0");
        const seconds = date
            .getSeconds()
            .toString()
            .padStart(2, "0");
        this.time = `${hours}:${minutes}:${seconds}`;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.time {
    font-size: 5rem;
    justify-self: center;
    align-self: center;
}
</style>
