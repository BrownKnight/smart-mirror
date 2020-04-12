import fetch from "node-fetch";
import * as ical2json from "ical2json";
import moment from "moment";
import * as config from "../../config.json";

type iCalEvent = {
    CREATED: string;
    "DTEND;TZID=Europe/London": moment.Moment;
    DTSTAMP: Date;
    "DTSTART;TZID=Europe/London": Date;
    "LAST-MODIFIED": Date;
    LOCATION: string;
    SEQUENCE: string;
    SUMMARY: string;
    UID: string;
};

type CalEvent = {
    title: string;
    location: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
};

export default class Calendar {
    private async getiCal() {
        return await fetch(config.iCalUrl)
            .then(data => data.text())
            .then(data => {
                let json = ical2json.convert(data);
                return json;
            })
            .catch(error => {
                console.error("Failed to download iCal file");
                console.error(error);
            });
    }

    async getEvents(startDate: moment.Moment, endDate: moment.Moment) {
        return await this.getiCal().then(json => {
            let iCalEventList: Array<iCalEvent> = json["VCALENDAR"][0]["VEVENT"];
            iCalEventList = iCalEventList.filter(event => {
                event["DTEND;TZID=Europe/London"] = moment(event["DTEND;TZID=Europe/London"], "YYYYMMDDThhmmss");
                if (event["DTEND;TZID=Europe/London"] > startDate && event["DTEND;TZID=Europe/London"] < endDate) {
                    return true;
                } else {
                    return false;
                }
            });

            let eventList: Array<CalEvent> = [];
            iCalEventList.forEach(event => {
                eventList.push({
                    title: event.SUMMARY,
                    location: event.LOCATION,
                    startDate: moment(event["DTSTART;TZID=Europe/London"], "YYYYMMDDThhmmss"),
                    endDate: event["DTEND;TZID=Europe/London"]
                });
            });
            return eventList;
        });
    }
}
