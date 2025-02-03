"use strict";
import { ApiResponse } from "../classes/ApiResponse.js";
import { ApiParameter } from "../classes/ApiParameter.js";

export class ConfigService{
    #configFileLocation = "../../config/config.json"
    #configData = {
        apiEndpoint: null,
        apiOptions: null,
        location: null
    }
    constructor(){
    }

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
                location: fetchedConfig.location
            };
            console.log(this.#configData);
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
        return configObject && configObject.apiEndpoint && configObject.location;
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

    getLocation(){
        return this.#configData.location;
    }

    getCity(){
        return this.#configData.location.cityName;
    }

    reduceOptionValues(values){
        if(!values instanceof Array){
            return values
        }
        return values.reduce((stringBuilder, current, index) => {
            const toAdd =  index === 0 ? current : `,${current}`;
            return `${stringBuilder}${toAdd}`
        },"")
    }

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