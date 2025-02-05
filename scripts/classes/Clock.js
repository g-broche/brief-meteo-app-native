"use strict";
import { Converter } from "../utils/Converter.js";
import { DomEditor } from "../utils/DomEditor.js";

export class Clock{
    #domElement = null;
    #currentTime = null;
    #previousTime = null;
    #tickerDelay = 1000;
    #intervalId = null;
    #isInitialized = false;
    #isSync = false;
    #callbackOnClockTrigger;
    constructor({domElementId, callbackOnClockTrigger}){
        this.#domElement = document.getElementById(domElementId);
        this.#callbackOnClockTrigger = callbackOnClockTrigger;
    }

    setTickerDelay(newValue){
        this.#tickerDelay = newValue;
    }

    handleTick(){
        this.#previousTime = this.#currentTime;
        this.#currentTime = new Date;
        if(!this.#isSync && this.#currentTime.getSeconds() === 0){
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

    restartClockTicker(){
        clearInterval(this.#intervalId);
        this.startClockTicker();
    }

    startClockTicker(){
        this.#intervalId = setInterval(()=>{
            this.handleTick();
        }, this.#tickerDelay);
    }

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