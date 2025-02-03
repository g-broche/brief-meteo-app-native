"use strict";

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