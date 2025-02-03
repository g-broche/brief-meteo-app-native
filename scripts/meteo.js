"use strict"
import { ConfigService } from "./services/ConfigService.js";
import { ApiService } from "./services/ApiService.js";
import { DisplayService } from "./services/DisplayService.js";
import { Clock } from "./classes/Clock.js";
import { WeatherComponent } from "./components/WeatherComponent.js";
import { LoaderComponent } from "./components/LoaderComponent.js";

const run = async function(){
    const CONFIG_SERVICE = new ConfigService();
    await CONFIG_SERVICE.loadConfig();
    const WEATHER_COMPONENT = new WeatherComponent();
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
    DISPLAY_SERVICE.hideWeatherInfo({message: "Loading weather informations"});
    DISPLAY_SERVICE.appendChildrenToWrapper();
    const API_PARAMETERS = CONFIG_SERVICE.getApiParameterArray();
    const API_SERVICE = new ApiService(
        {
            apiEndpoint: CONFIG_SERVICE.getApiEndpoint(),
            parameters: API_PARAMETERS,
            callbackAfterFetchAction: (apiResponse) => {
                console.log(apiResponse.getMessage());
                DISPLAY_SERVICE.refreshInformationDisplay(apiResponse);
            }
        }
    )

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