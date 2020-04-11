<template>
    <div class="date">
        <div>{{ date }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DateString extends Vue {
    date = "Loading...";
    
    // If I was smart I would use moment.js here, but this'll do
    readonly months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
    readonly days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    created() {
        this.currentDate();
        setInterval(this.currentDate, 5 * 60 * 1000);
    }

    currentDate() {
        const dateObject: Date = new Date();
        const day = dateObject.getDay();
        const dayOfMonth = dateObject.getDate();
        const month = dateObject.getMonth();

        this.date = `${this.days[day]} ${dayOfMonth} ${this.months[month]}`;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.date {
    font-size: 1.25rem;
}
</style>
