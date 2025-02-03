"use strict";
import { DomEditor } from "../utils/DomEditor.js";

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
            this.toggleFromWeatherToLoader(apiResponse.getMessage());
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

    appendChildrenToWrapper(){
        this.#domWrapperParent.append(this.loaderComponent.getDomElement(), this.weatherComponent.getDomElement());
    }
}
