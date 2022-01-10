/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import {onMouseDown, onMouseUp, onMouseMove} from '../utils/input.mjs'
import {modifyMouseOut} from './Mouse.mjs'

let canvas;

/**
 * the visual layer of the canvas
 */
let context;

/** getter method for the canvas */
export const getCanvas = () => canvas

/** setter method for the canvas */
export const modifyCanvas = (newCanvas) => canvas = newCanvas

/** a method that will clean the canvas completely */
export function cleanCanvas() {
	context.clearRect(0, 0,canvas.width, canvas.height)
	context.globalAlpha = 1
}

/**adds the events for the user interaction with the canvas */
export const addEventsListenersToCanvas = () => {
    canvas.addEventListener("mousedown", onMouseDown, false)
	canvas.addEventListener("mouseup", onMouseUp, false)
	canvas.addEventListener("mousemove", onMouseMove, false)
	canvas.addEventListener("mouseout",() => modifyMouseOut(true), false)
	canvas.addEventListener("mouseenter",() => modifyMouseOut(false),false)
}

/**sets the line width to 3 */
export const setLineWidth = () => context.lineWidth = 3

/** creates a new context layer on the canvas */
export const modifyContext = (newContext) =>  context = newContext

/**getter method for the canvas' context */
export const getContext = () => context
