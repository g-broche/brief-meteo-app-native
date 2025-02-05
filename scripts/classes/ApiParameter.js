"use strict";

/**
 * Class used to handle parsing of api parameters by encompassing the parameter's name and its value inside
 * a class with getters
 */
export class ApiParameter{
    #name;
    #value;
    constructor({parameterName, parameterValue}){
        this.#name = parameterName;
        this.#value = parameterValue;
    }
    getName(){
        return this.#name;
    }
    getValue(){
        return this.#value;
    }
    getUriParameterString(){
        return `${this.#name}=${this.#value}`
    }
}