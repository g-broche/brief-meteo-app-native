"use strict"
import { ConfigService } from "./services/ConfigService.js";
import { ApiService } from "./services/ApiService.js";
import { DisplayService } from "./services/DisplayService.js";
import { Clock } from "./classes/Clock.js";
import { WeatherComponent } from "./components/WeatherComponent.js";
import { LoaderComponent } from "./components/LoaderComponent.js";

const run = async function(){
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
    
    DISPLAY_SERVICE.displayTitle(`Weather in ${CONFIG_SERVICE.getCity()}`);
    DISPLAY_SERVICE.displayLoader({message: "Loading weather informations"});
    DISPLAY_SERVICE.hideWeatherInfo();
    DISPLAY_SERVICE.appendChildrenToWrapper();

    const API_PARAMETERS = CONFIG_SERVICE.getApiParameterArray();

    const handleApiResponse = (apiResponse) => {
        console.log("api response : ", apiResponse);
        DISPLAY_SERVICE.refreshInformationDisplay(apiResponse, CONFIG_SERVICE.getWeatherConverionTable());
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