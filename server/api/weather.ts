import fetch from 'node-fetch'

type WeatherJson = {
    summary: string,
    icon: string,
    temperature: number,
    apparentTemperature: number
};


export default class Weather {
    // API Key for forecast.io
    private apiKey = "94afa34c0fe89daa3ddc36a01edb1aa0";
    // Location for Mimbridge
    private location = "51.340050,-0.583090";
    private apiUrl = `https://api.darksky.net/forecast/${this.apiKey}/${this.location}?units=si&exclude=minutely,hourly,alerts,flags`;

    getWeather(): Promise<WeatherJson> {
        let weather = {
            icon: "",
            temperature: -1,
            apparentTemperature: -1,
            summary: ""
        };

        return fetch(this.apiUrl)
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res;
            })
            .then(res => res.json())
            .then(json => {
                let data = json.currently
                weather.icon = data.icon;
                weather.summary = data.summary;
                weather.temperature = data.temperature;
                weather.apparentTemperature = data.apparentTemperature;
                return weather;
            })
            .catch((statusText) => {
                weather.icon = "error";
                weather.summary = "error" + statusText;
                weather.temperature = -99;
                weather.apparentTemperature = -99;
                return weather;
            })
    }
}
