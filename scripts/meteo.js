"use strict"
import { ConfigService } from "./services/ConfigService.js";
import { ApiService } from "./services/ApiService.js";
import { DisplayService } from "./services/DisplayService.js";
import { Clock } from "./classes/Clock.js";
import { WeatherComponent } from "./components/WeatherComponent.js";
import { LoaderComponent } from "./components/LoaderComponent.js";
import { ApiResponse } from "./classes/ApiResponse.js";

const run = async function(){

    /**
     * Setting up required services and components
     */

    const CONFIG_SERVICE = new ConfigService();
    const loadConfigResult = await CONFIG_SERVICE.loadConfig();

    if(!loadConfigResult.isSuccess()){
        const message = loadConfigResult.getMessage() ?? "Could not load app config"
        console.log(message)
        throw new Error(message);
    }

    const WEATHER_COMPONENT = new WeatherComponent(CONFIG_SERVICE.getWeatherConverionTable());
    const LOADER_COMPONENT = new LoaderComponent();
    const DISPLAY_SERVICE = new DisplayService(
        {
            idTitleElement: "meteo-card-title",
            idWrapperParent: "content-wrapper",
            loaderComponent: LOADER_COMPONENT,
            weatherComponent: WEATHER_COMPONENT
        }
    );

    /**
     * initialize known information based on config, append dynamic components to the document
     * and display initial state
     */
    
    DISPLAY_SERVICE.displayTitle(`Weather in ${CONFIG_SERVICE.getCity()}`);
    DISPLAY_SERVICE.displayLoader("Loading weather informations");
    DISPLAY_SERVICE.hideWeatherInfo();
    DISPLAY_SERVICE.appendChildrenToWrapper();

    const API_PARAMETERS = CONFIG_SERVICE.getApiParameterArray();

    /**
     * Handle the API response it receives.
     * In case of both success and failure will call DisplayService to toggle the appropriate display.
     * In case of failure it will also trigger a new fetch attempt after a delay has passed.
     * @param {ApiResponse} apiResponse state of the response given by ApiService after a fetch call
     */
    const handleApiResponse = (apiResponse) => {
        console.log("api response : ", apiResponse);
        DISPLAY_SERVICE.refreshInformationDisplay(apiResponse, CONFIG_SERVICE.getWeatherConverionTable());
        if(apiResponse && !apiResponse.isSuccess()){
            //using delay before new attempt based on config settings with fallback in case of undefined value
            const retryDelay = CONFIG_SERVICE.getRetryDelay() ?? 60000;
            console.log(`attempting new fetch after failed attempt in ${retryDelay/1000}s`);
            setTimeout(() => {
                API_SERVICE.fetchData();
            }, retryDelay)
        }
    };

    const API_SERVICE = new ApiService(
        {
            apiEndpoint: CONFIG_SERVICE.getApiEndpoint(),
            parameters: API_PARAMETERS,
            callbackAfterFetchAction: handleApiResponse
        }
    );

    const CLOCK = new Clock(
        {
            domElementId : "clock",
            callbackOnClockTrigger : () => {
                API_SERVICE.fetchData();
            }
        }
    )
    CLOCK.startClockTicker();
}

run();