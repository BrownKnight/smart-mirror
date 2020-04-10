<template>
    <div class="weather">
        <div>{{ phrase }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Weather extends Vue {
    iconName = "";
    phrase = "";
    temperature = 0;
    tagLine = "";

    // API Key for forecast.io
    private apiKey = "94afa34c0fe89daa3ddc36a01edb1aa0";
    // Location for Mimbridge
    private location = "51.340050,-0.583090";
    private apiUrl = `https://api.darksky.net/forecast/${this.apiKey}/${this.location}?units=si&exclude=minutely,hourly,alerts,flags`;

    created() {
        this.currentWeather();
        // Check every 10 minutes
        setInterval(this.currentWeather, 10 * 60 * 1000);
    }

    currentWeather() {
        fetch(this.apiUrl)
            .then(res => {
                if (!res.ok) {
                    this.iconName = "error";
                    this.phrase = "Error";
                    this.temperature = res.status;
                    this.tagLine = res.statusText;
                    throw Error;
                }
                return res;
            })
            .then(res => res.json())
            .then(json => {
                console.log(json.currently);
            })
            .catch(null);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.weather {
    font-size: 5rem;
    justify-self: center;
    align-self: center;
}
</style>
