<template>
    <div class="weather">
        <div class="row">
            <div id="temperature">
                <div id="actual-temperature">{{ temperature }}&deg;</div>
                <div id="apparent-temperature">Feels Like {{ apparentTemperature }}&deg;</div>
            </div>
            <div id="icon"><img :src="icon" alt="" /></div>
        </div>
        <div class="details">
            <div id="phrase" v-html="phrase"></div>
            <div id="tag-line">{{ tagLine }}</div>
        </div>
        <div></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as data from "../assets/weather/phrases.json";

@Component
export default class Weather extends Vue {
    apiUrl = "/api/weather";

    icon = "";
    summary = "";
    temperature = -1;
    apparentTemperature = -1;

    phrase = "";
    tagLine = "";

    created() {
        this.currentWeather();
        // Check every 10 minutes
        setInterval(this.currentWeather, 10 * 60 * 1000);
    }

    currentWeather() {
        fetch(this.apiUrl)
            .then(res => res.json())
            .then(json => {
                const icon = json.icon;
                const summary = json.summary;
                const temperature = json.temperature;
                const apparentTemperature = json.apparentTemperature;

                this.icon = require(`@/assets/weather/icon/${icon.replace(/-/g, "_")}.png`);
                this.temperature = Math.round(temperature);
                this.apparentTemperature = Math.round(apparentTemperature);

                let summaryText = summary;
                summaryText = summaryText
                    .toLowerCase()
                    .replace(/(day)/g, "")
                    .replace(/(night)/g, "")
                    .replace(/_/g, " ")
                    .trim();

                // Loop over all the phrases until we find one which is a good match
                let possiblePhrases = data.phrases.copyWithin(0, 0, 0);
                possiblePhrases = [];
                data.phrases.forEach(phrase => {
                    if (phrase.condition === summaryText) {
                        if (phrase.min == undefined && phrase.max == undefined) {
                            possiblePhrases.push(phrase);
                            return;
                        } else if (phrase.min == undefined) {
                            if (phrase.max > temperature) {
                                possiblePhrases.push(phrase);
                                return;
                            }
                        } else if (phrase.max == undefined) {
                            if (phrase.min < temperature) {
                                possiblePhrases.push(phrase);
                                return;
                            }
                        } else if (phrase.min < temperature && phrase.max > temperature) {
                            possiblePhrases.push(phrase);
                            return;
                        }
                    } else if (phrase.condition == undefined) {
                        if (phrase.min == undefined && phrase.max == undefined) {
                            possiblePhrases.push(phrase);
                            return;
                        } else if (phrase.min == undefined) {
                            if (phrase.max > temperature) {
                                possiblePhrases.push(phrase);
                                return;
                            }
                        } else if (phrase.max == undefined) {
                            if (phrase.min < temperature) {
                                possiblePhrases.push(phrase);
                                return;
                            }
                        } else if (phrase.min < temperature && phrase.max > temperature) {
                            possiblePhrases.push(phrase);
                            return;
                        }
                    }
                });

                const chosenPhrase = possiblePhrases[Math.floor(Math.random() * possiblePhrases.length)];
                this.tagLine = chosenPhrase.subline;

                let formattedPhrase = chosenPhrase.title;
                const startIndex = formattedPhrase.indexOf(chosenPhrase.highlight[0]);
                const endIndex = formattedPhrase.indexOf("|", startIndex);

                const prefix = formattedPhrase.substring(0, startIndex);
                let highlight = formattedPhrase.substring(startIndex, endIndex);
                const suffix = formattedPhrase.substring(endIndex);
                highlight = highlight.italics();
                formattedPhrase = `${prefix != "" ? prefix + "<br/>" : ""}<span style="color: ${
                    chosenPhrase.color
                }">${highlight}</span><br/>${suffix}`;

                formattedPhrase = formattedPhrase.replace(/\|/g, " ");
                this.phrase = formattedPhrase;
            })
            .catch(error => {
                console.log(error);
                this.icon = "error";
                this.summary = "error";
                this.temperature = -1;
                this.apparentTemperature = -1;
            });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.weather {
    font-size: 1rem;
    justify-self: center;
    align-self: center;
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
}

.weather > .row {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding: 0.5rem;
}

img {
    width: 7rem;
}

#temperature {
    display: flex;
    flex-direction: column;
}

#actual-temperature {
    font-size: 4rem;
    line-height: 3.5rem;
    justify-self: center;
    margin-top: auto;
}
#apparent-temperature {
    margin-top: auto;
    justify-self: end;
}

#phrase {
    font-size: 2rem;
    text-align: right;
}
#tag-line {
    margin-top: 1rem;
    font-size: 1rem;
    text-align: center;
}
</style>
