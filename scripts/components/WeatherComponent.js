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
 *      <div class="left-pannel">
 *          <span id="temperature"></span> 
 *      <div>
 *          <span id="humidity"></span>
 *          <span id="wind"></span>
 *      </div>
 *      </div>
 *      <div class="weather-details right-pannel">
 *          <div class="image-wrapper">
 *              <img id="weather-icon">
 *          </div>
 *          <span id="weather-text"></span>
 *      </div>
 *  </div>
 * 
 */
export class WeatherComponent {
    #weatherConversionTable = null
    #assetImagesPath = "../../assets/images"
    #values = {
        temperature: null,
        weather: {
            description: null,
            img: null
        },
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
    constructor(weatherConversionTable) {
        this.#weatherConversionTable = weatherConversionTable;
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
        const meteoLeftPannel = DomEditor.createNewElement(
            {
                htmlTag: "div",
                classes: ["left-pannel"]
            }
        );
        const splitterDiv = DomEditor.createNewElement(
            {
                htmlTag: "div",
                classes: ["left-pannel__subsection"]
            }
        );
        const weatherDetailWrapper = DomEditor.createNewElement(
            {
                htmlTag: "div",
                classes: ["weather-details", "right-pannel"]
            }
        );
        const imageWrapper = DomEditor.createNewElement(
            {
                htmlTag: "div",
                classes: ["image-wrapper"]
            }
        );
        splitterDiv.append(
            this.#domElements.dynamicChildren.humidity,
            this.#domElements.dynamicChildren.wind
        )
        meteoLeftPannel.append(
            this.#domElements.dynamicChildren.temperature,
            splitterDiv

        )
        imageWrapper.append(this.#domElements.dynamicChildren.weatherIcon)
        weatherDetailWrapper.append(
            imageWrapper,
            this.#domElements.dynamicChildren.weatherText
        )
        this.#domElements.self.append(
            weatherDetailWrapper,
            meteoLeftPannel
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
        const parsedWeatherData = Converter.weatherCodeToWeatherInfo({
            weatherCode: weatherCode,
            conversionTable: this.#weatherConversionTable
        })
        this.#values = {
            temperature: temperature,
            weather: parsedWeatherData,
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
                imagePath: `${this.#assetImagesPath}/${this.#values.weather.img}`,
                altText: `missing ${this.#values.weather.description} image`
            }
        );
        DomEditor.updateElementText(
            {
                node: this.#domElements.dynamicChildren.weatherText,
                newText: this.#values.weather.description
            }
        );
        DomEditor.updateElementText(
            {
                node: this.#domElements.dynamicChildren.humidity,
                newText: `Humidity: ${this.#values.humidity}%`
            }
        );
        DomEditor.updateElementText(
            {
                node: this.#domElements.dynamicChildren.wind,
                newText: `Wind: ${this.#values.windSpeed}km/h - ${Converter.degreeToDirection(this.#values.windDirection)}`
            }
        );
    }
}


