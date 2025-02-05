"use strict";
import { DomEditor } from "../utils/DomEditor.js";

/**
 * class used to handle display of the loading visual and text message corresponding to the current
 * state of the fetching.
 * 
 * manages the following DOM structure :
 * 
 *      <div id="loader-wrapper">
 *          <p id="message-display">Loading weather data</p>
 *          <div class="loader-circle"></div>
 *      </div>
 */
export class LoaderComponent{
    #domElement = null;
    #childrenNode = {
        message: null,
        animation: null
    }
    /**
     * Creates the DOM elements and structure required by this component
     */
    constructor(){
        this.#domElement = DomEditor.createNewElement({htmlTag: "div", id: "loader-wrapper"});
        this.#childrenNode.message = DomEditor.createNewElement({htmlTag: "p", id: "message-display"});
        this.#childrenNode.animation = DomEditor.createNewElement({htmlTag: "div", classes: ["loader-circle"]});
        this.#domElement.append(this.#childrenNode.message, this.#childrenNode.animation);
    }

    /**
     * 
     * @returns DOM element corresponding to the wrapper element of this component
     */
    getDomElement(){
        return this.#domElement;
    }
    
    /**
     * Updates the message displayed when this component is displayed
     * @param {string} newMessage 
     */
    updateMessage(newMessage){
        DomEditor.updateElementText(
            {
                node: this.#childrenNode.message,
                newText: newMessage
            }
        );
    }
}
