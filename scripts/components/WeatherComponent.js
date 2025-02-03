"use strict";
import { DomEditor } from "../utils/DomEditor.js";
import { Converter } from "../utils/Converter.js";

/**
 * encompass values and DOM elements corresponding to all weather related data
 * and provides methods to interact with such values and elements
 * 
 * manages the following DOM structure :
 * 
 *  <div id="meteo-details">
 *      <span id="temperature"></span> 
 *      <div class="weather-details">
 *          <img id="weather-icon">
 *          <span id="weather-text"></span>
 *      </div>
 *      <span id="humidity"></span>
 *      <span id="wind"></span>
 *  </div>
 * 
 */
export class WeatherComponent {
    #values = {
        temperature: null,
        weatherCode: null,
        humidity: null,
        windSpeed: null,
        windDirection: null
    };
    #domElements = {
        self: null,
        dynamicChildren: {
            temperature: null,
            weatherIcon: null,
            weatherText: null,
            humidity: null,
            wind: null
        }
    };
    constructor() {
        this.#domElements = {
            self: DomEditor.createNewElement({ htmlTag: "div", id: "meteo-details" }),
            dynamicChildren: {
                temperature: DomEditor.createNewElement({ htmlTag: "span", id: "temperature" }),
                weatherIcon: DomEditor.createNewElement({ htmlTag: "img", id: "weather-icon" }),
                weatherText: DomEditor.createNewElement({ htmlTag: "span", id: "weather-text" }),
                humidity: DomEditor.createNewElement({ htmlTag: "span", id: "humidity" }),
                wind: DomEditor.createNewElement({ htmlTag: "span", id: "wind" })
            }
        };
        const weatherDetailWrapper = DomEditor.createNewElement(
            {
                htmlTag: "div",
                classes: ["weather-details"]
            }
        );
        weatherDetailWrapper.append(
            this.#domElements.dynamicChildren.weatherIcon,
            this.#domElements.dynamicChildren.weatherText
        )
        this.#domElements.self.append(
            this.#domElements.dynamicChildren.temperature,
            weatherDetailWrapper,
            this.#domElements.dynamicChildren.humidity,
            this.#domElements.dynamicChildren.wind
        )
    }

    setValues(
        {
            temperature,
            weatherCode,
            humidity,
            windSpeed,
            windDirection
        }
    ) {
        this.#values = {
            temperature: temperature,
            weatherCode: weatherCode,
            humidity: humidity,
            windSpeed: windSpeed,
            windDirection: windDirection
        }
    }

    getDomElement() {
        return this.#domElements.self;
    }

    updateDOM() {
        DomEditor.updateElementText(
            {
                node: this.#domElements.dynamicChildren.temperature,
                newText: `${this.#values.temperature}°C`
            }
        );
        DomEditor.updateImageContent(
            {
                imageNode: this.#domElements.dynamicChildren.weatherIcon,
                imagePath: Converter.weatherTypeToWeatherIcon(this.#values.weather),
                altText: `${this.#values.weatherCode} icon`
            }
        );
        DomEditor.updateElementText(
            {
                node: this.#domElements.dynamicChildren.weatherText,
                newText: this.#values.weatherCode
            }
        );
        DomEditor.updateElementText(
            {
                node: this.#domElements.dynamicChildren.humidity,
                newText: `${this.#values.humidity}%`
            }
        );
        DomEditor.updateElementText(
            {
                node: this.#domElements.dynamicChildren.wind,
                newText: `${this.#values.windSpeed} - ${this.#values.windDirection}`
            }
        );
    }
}


