const { Point } = require('../geometry/geometry');

class CanvasManager {
    /**@type {Number} */
    width;
    /**@type {Number} */
    height;
    /**@type {HTMLElement} */
    canvas;
    /**@type {Point} */
    pressPoint;

    constructor(_canvas) {
        canvas = _canvas;
    }

    /**
     * 
     * @param {CanvasManager} canvasManager 
     */
    static OnMouseDown(canvasManager, event) {
//        canvasManager.pressPoint = 
    }
}