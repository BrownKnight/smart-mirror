<template>
    <div id="app">
        <Greeting id="greeting" />
        <Weather id="weather" />
        <Time id="time" />
        <DateString id="date-string" />
        <Calendar id="calendar" />
        <!-- <Leon id="leon" /> -->
        <AppleMusic id="apple-music" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Time from "./components/Time.vue";
import DateString from "./components/DateString.vue";
import Greeting from "./components/Greeting.vue";
import Weather from "./components/Weather.vue";
import Calendar from "./components/Calendar.vue";
// import Leon from "./components/Leon.vue";
import AppleMusic from "./components/AppleMusic.vue";

@Component({
    components: {
        Greeting,
        Time,
        Weather,
        DateString,
        Calendar,
        // Leon,
        AppleMusic
    }
})
export default class App extends Vue {}
</script>

<style>
body {
    background-color: black;
    color: whitesmoke;
    padding: 0;
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    display: grid;
    grid-template-columns: [left-l] 19% [left-c] 19% [left-r centre-l] 1fr [centre-c] 1fr [centre-r right-l] 19% [right-c] 19% [right-r];
    grid-template-rows: repeat(20, 5vh);
    width: 100vw;
    height: 100vh;
    text-overflow: clip;
}
#app > div {
    padding: 1rem;
}

#greeting {
    grid-column: left-c / right-c;
    grid-row: 1 / span 1;
}

#time {
    grid-column: right-l / right-r;
    grid-row: 1 / span 2;
}

#weather {
    grid-column: left-l / left-r;
    grid-row: 1 / span 4;
    align-self: start;
}

#date-string {
    grid-column: right-l / right-r;
    grid-row: 1 / span 2;
    align-self: end;
}

#calendar {
    grid-column: right-l / right-r;
    grid-row: 1 / span auto;
}
</style>
