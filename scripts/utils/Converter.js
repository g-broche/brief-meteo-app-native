"use strict";

export class Converter{

    static weatherTypeToWeatherIcon(weatherType){
        const weatherImage = "test.webp";
        return `../../assets/icons/${weatherImage}`;
    }

    static formatTime({date, format}){
        let formatedTime;
        let hours = date.getHours().toString();
        let minutes = date.getMinutes().toString();
        let seconds = date.getSeconds().toString();
        hours = hours.length === 2 ? hours : `0${hours}`;
        minutes = minutes.length === 2 ? minutes : `0${minutes}`;
        seconds = seconds.length === 2 ? seconds : `0${seconds}`;

        switch (format) {
            case "hh:mm:ss":
                formatedTime = `${hours}:${minutes}:${seconds}`;
                break;
            case "hh:mm":
                formatedTime = `${hours}:${minutes}`;
                break;
            default:
                formatedTime = `${hours}:${minutes}`;
                break;
        }
        return formatedTime;
    }

    static apiDataToAppData({apiData}){
        const apiCurrentValues = apiData.current
        return {
            temperature: apiCurrentValues.temperature_2m,
            weatherCode: apiCurrentValues.weather_code,
            humidity: apiCurrentValues.relative_humidity_2m,
            windSpeed: apiCurrentValues.wind_speed_10m,
            windDirection: apiCurrentValues.wind_direction_10m
        }
    }
}