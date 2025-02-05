"use strict";

/**
 * class providing an easy way to handle passing complex responses with states and data.
 */
export class ApiResponse{
    #success;
    #code;
    #data;
    #message;
    constructor({success, code, data = [], message = ""}){
        this.#success = success;
        this.#code = code;
        this.#data = data;
        if (success === false) {
            message = message && message.length > 0
                ? `${message} ; response code ${code}`
                : `An error occurred while requesting the API ; response code ${code}`
        }
        this.#message = message;
    }

    isSuccess(){
        return this.#success;
    }
    getCode(){
        return this.#code;
    }
    getData(){
        return this.#data;
    }
    getMessage(){
        return this.#message;
    }
}