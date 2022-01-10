/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */
import {onKeyPress, onKeyDown} from './utils/input.mjs'
import {button_handlers} from './button_mgmt.mjs'
import {validateInput} from './engine.mjs'
import {modifyTransitionList} from './globals/Transitions.mjs'
import {modifyStateList} from './globals/States.mjs';
import {getCanvas, modifyCanvas,
		addEventsListenersToCanvas, setLineWidth, 
		modifyContext} from './globals/Canvas.mjs';
import {draw} from './utils/drawing.mjs'

/**
 * This method is called when the window on the 
 * browser is loaded. 
 */
window.onload = function () {	
	start()
	setInterval(draw, 1000 / 60)
	setInterval(validateInput, 1000 / 60)
}

/**
 * This method is in charge of preparing 
 * the DOM in order for the keyword and mouse
 * events to work properly. 
 */
export function start() {
	button_handlers()
	modifyStateList([])
	modifyTransitionList([])

	modifyCanvas(document.getElementById("main-canvas"))
	modifyContext(getCanvas().getContext("2d"))

	addEventsListenersToCanvas()

	window.addEventListener("keypress", onKeyPress, false)
	window.addEventListener("keydown", onKeyDown, false)

	setLineWidth()
}



