"use strict";
import { Converter } from "../utils/Converter.js";
import { DomEditor } from "../utils/DomEditor.js";

/**
 * Class used to trigger events during the lifecyle of the application
 */
export class Clock{
    #domElement = null;
    #currentTime = null;
    #previousTime = null;
    #tickerDelay = 1000;
    #intervalId = null;
    #isInitialized = false;
    #isSync = false;
    #callbackOnClockTrigger;
    /**
     * 
     * @param {Object} param0 object wrapper
     * @param {string} domElementId id of the html element used to display the current time 
     * @param {function} param0 callback to execute when required
     */
    constructor({domElementId, callbackOnClockTrigger}){
        this.#domElement = document.getElementById(domElementId);
        this.#callbackOnClockTrigger = callbackOnClockTrigger;
    }

    setTickerDelay(newValue){
        this.#tickerDelay = newValue;
    }

    /**
     * Handle the logic at every tick to update the time and refresh the weather data hourly if required
     * @returns 
     */
    handleTick(){
        this.#previousTime = this.#currentTime;
        this.#currentTime = new Date;
        if(!this.#isSync && this.#currentTime.getSeconds() === 0){
            //while initially the ticker has a delay of 1s, this is not necessary in the long run. This part serves to
            //change the ticker delay to 60sec when the system clock changes minute for the first time.
            console.log(`clock has sync at time ${this.#currentTime}`);
            this.setTickerDelay(60000);
            this.restartClockTicker();
            this.#isSync = true;
        }
        if(!this.#isInitialized){
            this.updateDisplayedTime();
            this.#isInitialized = true;
            console.log(`clock has initialized at time ${this.#currentTime}`);
            this.#callbackOnClockTrigger();
            return;
        }
        if(this.#currentTime.getMinutes() !== this.#previousTime.getMinutes()){
            this.updateDisplayedTime();
        }
        if(this.#currentTime.getHours() !== this.#previousTime.getHours()){
            console.log(`clock has fetched data hourly on interval at ${this.#currentTime}`);
            this.#callbackOnClockTrigger();
        }
    }

    /**
     * Cancels current interval and start a new one (for use if the delay must be changed)
     */
    restartClockTicker(){
        clearInterval(this.#intervalId);
        this.startClockTicker();
    }

    /**
     * Starts interval ticker using tickerDelay property value for the delay
     */
    startClockTicker(){
        this.#intervalId = setInterval(()=>{
            this.handleTick();
        }, this.#tickerDelay);
    }

    /**
     * update displayed time
     */
    updateDisplayedTime(){
        const timeToDisplay = Converter.formatTime({date: this.#currentTime, format: "hh:mm"});
        DomEditor.updateElementText(
            {
                node : this.#domElement,
                newText : timeToDisplay
            }
        );
    }
}