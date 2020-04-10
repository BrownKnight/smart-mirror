<template>
    <div id="app">
        <Greeting id="greeting" />
        <Time id="time" />
        <Weather id="weather" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Time from "./components/Time.vue";
import Greeting from "./components/Greeting.vue";
import Weather from "./components/Weather.vue";

@Component({
    components: {
        Greeting,
        Time,
        Weather
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
    grid-template-columns: [left-l] 16% [left-c] 16% [left-r centre-l] 1fr [centre-c] 1fr [centre-r right-l] 16% [right-c] 16% [right-r];
    grid-template-rows: repeat(20, 5vh);
    width: 100vw;
    height: 100vh;
    text-overflow: clip;
}
#app > div {
    padding: 1.5rem;
}

#greeting {
    grid-column: left-c / right-c;
    grid-row: 1 / span 1;
}

#time {
    grid-column: left-l / centre-c;
    grid-row: 1 / span 2;
}
</style>
