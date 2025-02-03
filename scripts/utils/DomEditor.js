"use strict";

export class DomEditor{
    static createNewElement({htmlTag, id = null, classes = []}){
        const newElement = document.createElement(htmlTag);
        if (id) {
            newElement.id = id;
        }
        if (classes && classes.length > 0){
            newElement.classList.add(...classes);
        }
        return newElement;
    }

    static createNewElementWithInnerHTMLContent({htmlTag, id = null, classes = [], innerHTML=""}){
        const newElement = this.createNewElement({htmlTag: htmlTag, id: id, classes: classes});
        newElement.innerHTML = innerHTML;
        return newElement;
    }

    static updateElementText({node, newText}){
        node.textContent = newText;
    }

    static updateImageContent({imageNode, imagePath, altText}){
        imageNode.src = imagePath;
        imageNode.alt = altText;
    }

    static showElement({element}){
        element.classList.remove("display-none");
    }

    static hideElement({element}){
        element.classList.add("display-none");
    }
}