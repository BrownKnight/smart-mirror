<template>
    <div class="calendar">
        <div class="event" v-if="eventList.length === 0">
            <div id="no-event-info">No Events</div>
        </div>

        <div class="event" v-for="event in eventList" :key="event">
            <div id="info">
                <div id="title">{{ event.title }}</div>
                <div id="location" v-if="event.location != ''">{{ event.location }}</div>
            </div>
            <div id="start-date">{{ event.startDate.format("HH:mm") }}</div>
            <div id="end-date">{{ event.endDate.format("HH:mm") }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";

type CalEvent = {
    title: string;
    location: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
};

@Component
export default class Calendar extends Vue {
    private mode = "real";

    eventList: Array<CalEvent> = [];

    created() {
        this.getCalenderEvents();
        // Once an hour = 60min*60sec*1000ms
        setInterval(this.getCalenderEvents, 60 * 60 * 1000);
    }

    getCalenderEvents() {
        if (this.mode == "stub") {
            this.eventList = [];
            // this.eventList.push({
            //     title: "Some Event 1",
            //     location: "Some Location",
            //     startDate: moment(),
            //     endDate: moment()
            // });
            // this.eventList.push({
            //     title: "Some Event 2",
            //     location: "",
            //     startDate: moment(),
            //     endDate: moment()
            // });
            // this.eventList.push({
            //     title: "Some Event 3",
            //     location: "",
            //     startDate: moment(),
            //     endDate: moment()
            // });
            // this.eventList.push({
            //     title: "Some Event 4",
            //     location: "Some Other Location",
            //     startDate: moment(),
            //     endDate: moment()
            // });
        } else {
            fetch("/api/calendar")
                .then(res => res.json())
                .then(json => {
                    this.eventList = json;
                })
                .catch(error => {
                    console.error("Failed to fetch calender");
                    console.error(error);
                });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.event {
    padding: 0.6rem 1rem;
    margin: 0 1rem;
    border-top: 1px solid whitesmoke;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: stretch;
}
.event > #no-event-info {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
}
#info {
    display: flex;
    flex-direction: column;
    grid-column: 1;
    grid-row: 1 / span 2;
    justify-content: space-around;
}
#title {
    font-size: 1rem;
    text-align: left;
}
#location {
    font-size: 0.8rem;
    text-align: left;
}
#start-date {
    font-size: 0.8rem;
    text-align: right;
    grid-column: 2;
    grid-row: 1;
}
#end-date {
    font-size: 0.8rem;
    text-align: right;
    grid-column: 2;
    grid-row: 2;
}
</style>
