"use strict";

export class Converter{

    static weatherCodeToWeatherInfo({weatherCode, conversionTable}){
        if(!weatherCode){
            throw new Error("Error: Missing weather code on weather code to weather info conversion"); 
        }
        if(!conversionTable){
            throw new Error("Error: Missing conversion table on weather code to weather info conversion"); 
        }
        if(!conversionTable[weatherCode]){
            return conversionTable["error"];
        }
        return conversionTable[weatherCode];
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

    static degreeToDirection(angle){
        //considering  45° per direction with N starting at 360-45/2 and ending at 0+45/2
        const degreeToDirectionTable = [
            { label: "N", start: 337.5, end: 22.5 },
            { label: "NE", start: 22.5, end: 67.5 },
            { label: "E", start: 67.5, end: 112.5 },
            { label: "SE", start: 112.5, end: 157.5 },
            { label: "S", start: 157.5, end: 202.5 },
            { label: "SW", start: 202.5, end: 247.5 },
            { label: "W", start: 247.5, end: 292.5 },
            { label: "NW", start: 292.5, end: 337.5 },
        ];
        for (const direction of degreeToDirectionTable){
            //dealing with North case first as it's an exception to the overall logic do to +- angle from 0
            if(direction.start > direction.end){
                if(angle > direction.start || angle <= direction.end) {
                    return direction.label;
                }
            }
            //handling rest of the cases
            if(angle > direction.start && angle <= direction.end){
                return direction.label;
            }
        }
    }

    static apiDataToAppData({apiData}){
        if(!apiData){
            throw new Error("Error: Missing API data on API data to App data conversion"); 
        }
        const apiCurrentValues = apiData.current
        return {
            temperature: apiCurrentValues.temperature_2m,
            weatherCode: apiCurrentValues.weather_code,
            humidity: apiCurrentValues.relative_humidity_2m,
            windSpeed: apiCurrentValues.wind_speed_10m,
            windDirection: apiCurrentValues.wind_direction_10m
        };
    }
}