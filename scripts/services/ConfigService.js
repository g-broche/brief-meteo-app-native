"use strict";
import { ApiResponse } from "../classes/ApiResponse.js";
import { ApiParameter } from "../classes/ApiParameter.js";

/**
 * Retrieves the config parameters of the application and provides getters to access the 
 * different parameters
 */
export class ConfigService{
    #configFileLocation = "./config/config.json"
    #configData = {
        apiEndpoint: null,
        apiOptions: null,
        retryDelayAfterFailedFetch: null,
        location: null,
        weatherConversionTable: null,
    }
    constructor(){
    }

    /**
     * Retrieve the config parameters and stores them in private class properties
     * @returns ApiResponse instance indicating if the operation was successful 
     */
    async loadConfig(){
        try{
            const response = await fetch(this.#configFileLocation);
            const fetchedConfig = await response.json();
            if(!this.isConfigValid(fetchedConfig)){
                return new ApiResponse(
                    {
                        success: false,
                        code: 500,
                        data: null,
                        message: "Error: The config wasn't able to be retrieved from the required file"
                    }
                );
            }
            this.#configData = {
                apiEndpoint: fetchedConfig.apiEndpoint,
                apiOptions: fetchedConfig.apiOptions,
                retryDelayAfterFailedFetch: fetchedConfig.retryDelayAfterFailedFetch,
                location: fetchedConfig.location,
                weatherConversionTable: fetchedConfig.weathers
            };
            return new ApiResponse(
                {
                    success: true,
                    code: 200,
                    data: this.#configData,
                    message: "config initialized"
                }
            );
        } catch (error) {
            return new ApiResponse(
                {
                    success: false,
                    code: 500,
                    data: null,
                    message: "Error: The config wasn't able to be initialized"
                }
            );
        }
    }

    isConfigValid(configObject){
        return configObject && configObject.apiEndpoint && configObject.location && configObject.weathers;
    }

    getLoadedConfig(){
        return this.#configData;
    }

    getApiEndpoint(){
        return this.#configData.apiEndpoint;
    }

    getApiOptions(){
        return this.#configData.apiOptions;
    }

    getRetryDelay(){
        return this.#configData.retryDelayAfterFailedFetch;
    }

    getLocation(){
        return this.#configData.location;
    }

    getCity(){
        return this.#configData.location.cityName;
    }

    getWeatherConverionTable(){
        return this.#configData.weatherConversionTable;
    }

    /**
     * Given an array, returns a string formed by concatenating all values with an added "," separator
     * @param {string | string[]} values
     * @returns string
     */
    reduceOptionValues(values){
        if(!values instanceof Array){
            return values
        }
        return values.reduce((stringBuilder, current, index) => {
            const toAdd =  index === 0 ? current : `,${current}`;
            return `${stringBuilder}${toAdd}`
        },"")
    }

    /**
     * Creates an array based on the config file parameters necessary for the API endpoint in a way to
     * easily associate the name of the parameter and its value by encompassing them inside an ApiParameter class
     * @returns array of ApiParameters
     */
    getApiParameterArray(){
        let parameters = [];
        const locationData = this.#configData.location;
        parameters.push(new ApiParameter(
            {
                parameterName: "latitude",
                parameterValue: locationData.cityLatitude
            }
        ))
        parameters.push(new ApiParameter(
            {
                parameterName: "longitude",
                parameterValue: locationData.cityLongitude
            }
        ))
        for (const property in this.#configData.apiOptions) {
            parameters.push(new ApiParameter(
                {
                    parameterName: property,
                    parameterValue: this.reduceOptionValues(this.#configData.apiOptions[property])
                }
            ))
        }
        return parameters;
    }
}