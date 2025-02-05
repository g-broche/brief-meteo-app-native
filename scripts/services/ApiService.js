"use strict";
import { ApiResponse } from "../classes/ApiResponse.js";
import { Converter } from "../utils/Converter.js";

export class ApiService{
    #apiEndpoint;
    #parameters;
    #callbackAfterFetch;
    constructor(
        {
            apiEndpoint = "",
            parameters = [],
            callbackAfterFetchAction = null,
        }
    ){
        if(apiEndpoint.length < 20){
            const errorMsg = "Error: length of API provided to get weather data is too short";
            throw new Error(errorMsg);
        }
        if (!callbackAfterFetchAction) {
            const errorMsg = "Error: no callback action set after fetch event";
            throw new Error(errorMsg);
        }
        this.#apiEndpoint = apiEndpoint;
        this.#parameters = parameters;
        this.#callbackAfterFetch = callbackAfterFetchAction;
    }

    /**
     * constructs the url used to query the API based on the apiEndpoint and parameters property of this class
     * @returns built url for fetching from API
     */
    buildRequestString(){
        if (this.#parameters.length === 0) {
            return this.#apiEndpoint;
        }
        const parameterString = this.#parameters.reduce((builder, currentParameter, index) => {
            const newPart = index === 0
                ? currentParameter.getUriParameterString()
                : `&${currentParameter.getUriParameterString()}`
            return`${builder}${newPart}`
        }, "");
        return `${this.#apiEndpoint}?${parameterString}`;
    }

    triggerCallbackAfterFetch(ApiResponse){
        this.#callbackAfterFetch(ApiResponse)
    }

    /**
     * Fetch data from API using currently defined class properties and triggers defined callback after fetch function
     */
    async fetchData(){
        try {
            console.log(`Attempting fetch on ${new Date}`);
            const requestUrl = this.buildRequestString();
            let hasFetchFailed = false;
            let fetchedData = null;
            let responseResult = null;
            const response = await fetch(requestUrl);
            if (!response.ok){
                hasFetchFailed = true
                responseResult = new ApiResponse(
                    {
                        success: false,
                        code: response.status,
                        data: null,
                        message: "Error: an error occured while requesting the API"
                    }
                );
                this.triggerCallbackAfterFetch(responseFailedAttempt);
                return
            }
            fetchedData = await response.json();
            const parsedData = Converter.apiDataToAppData({apiData: fetchedData});
            responseResult = new ApiResponse(
                {
                    success: true,
                    code: response.status,
                    data: parsedData,
                    message: "Data successfully fetched from API"
                }
            );
            this.triggerCallbackAfterFetch(responseResult);
        } catch (error) {
            console.log(error)
            const catchErrorResponse = new ApiResponse(
                {
                    success: false,
                    code: 500,
                    data: null,
                    message: "Error: something unexpected triggered an exception while processing the API data"
                }
            );
            this.triggerCallbackAfterFetch(catchErrorResponse);
        }
    }
}