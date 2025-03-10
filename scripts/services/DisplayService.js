"use strict";
import { DomEditor } from "../utils/DomEditor.js";

/**
 * Service managing the display state of the dynamic components
 */
export class DisplayService{
    #domTitleElement;
    #domWrapperParent;
    loaderComponent;
    weatherComponent;
    constructor({idTitleElement, idWrapperParent, loaderComponent, weatherComponent}){
        this.#domTitleElement = document.getElementById(idTitleElement);
        this.#domWrapperParent = document.getElementById(idWrapperParent);
        this.loaderComponent = loaderComponent;
        this.weatherComponent = weatherComponent;
    }

    displayTitle(title){
        DomEditor.updateElementText(
            {
                node: this.#domTitleElement,
                newText: title
            }
        )
    }

    refreshInformationDisplay(apiResponse){
        if(!apiResponse.isSuccess()){
            this.toggleFromWeatherToLoader("Service is temporary unavailable");
            return;
        }
        this.toggleFromLoaderToWeather(apiResponse.getData());
    }

    displayWeatherInfo(weatherData){
        this.weatherComponent.setValues(weatherData);
        this.weatherComponent.updateDOM();
        DomEditor.showElement({element: this.weatherComponent.getDomElement()})
    }

    hideWeatherInfo(){
        DomEditor.hideElement({element: this.weatherComponent.getDomElement()}); 
    }

    displayLoader(message = "service is currently unavailable"){
        this.loaderComponent.updateMessage(message)

        DomEditor.showElement({element: this.loaderComponent.getDomElement()})
    }

    hideLoaderInfo(){
        DomEditor.hideElement({element: this.loaderComponent.getDomElement()});
    }

    toggleFromLoaderToWeather(weatherData){
        this.hideLoaderInfo();
        this.displayWeatherInfo(weatherData);
    }

    toggleFromWeatherToLoader(message){
        this.hideWeatherInfo();
        this.displayLoader(message);
    }

    /**
     * append the DOM elements of both loaderComponent and weatherComponent to the document
     */
    appendChildrenToWrapper(){
        this.#domWrapperParent.append(this.loaderComponent.getDomElement(), this.weatherComponent.getDomElement());
    }
}
