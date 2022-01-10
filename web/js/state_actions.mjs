/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import {addToStateList, getStateList, selectedState,
		modifySelectedState, State} from './globals/States.mjs';
import {createTransition, removeTransition} from './transition_actions.mjs'
import {getMouseCoord} from './globals/Mouse.mjs';
import {getCanvas} from './globals/Canvas.mjs'
import {Coord} from './globals/Coord.mjs'


/**
 * This function creates a new State 
 * and adds it to the global StateList.
 */
export function createState() {
	addToStateList(new State(
		Date.now(),
		'S' + getStateList().length.toString(),
		new Coord(getMouseCoord().x, getMouseCoord().y),
		false,
		false,
		[],
		[])
	)
}

/**
 * When the users want to create a new transition
 * they need to select a state. This comes as a 
 * parameter when they click on it.
 * @param state a state from the global StateList
 * @returns void
 */
export function selectState(state) {
	if (selectedState().adding_transition) {
		createTransition();
		return;
	}
	modifySelectedState({...selectedState(), id:state.id , selecting : true , moving : true})
}

/**
 * This function reset the selected state
 * in some cases is necesary to do that.
 */
export function resetSelectedState() {
	modifySelectedState({...selectedState(), id:-1 , selecting : false, naming : false})
}


/**
 * This method takes a state as argument and 
 * returns whether or not it is selected
 * @param state a state from the global StateList
 * @returns a boolean value
 */
export const isSelected = (state) => selectedState().id === state.id && selectedState().selecting;

/**
 * @returns a reference to the selected stated
 */
export const getSelectedState = () => {
	let state = getStateByID(selectedState().id) 
	let state_index = getStateList().indexOf(state)
	return getStateList()[state_index] ?? null
}

/**
 * This function changes the location of the state
 * in the canvas taking the position from the mouse.
 * @param state a state from the global StateList
 */
export function moveStateByCursor(state) {
	state.coord.x = 
		(state.coord.x + state.radius > getCanvas().width) ? getCanvas().width - state.radius 
		: (state.coord.x - state.radius < 0) ? state.radius : getMouseCoord().x

	state.coord.y = 
		(state.coord.y + state.radius > getCanvas().height) ? getCanvas().height - state.radius
		: (state.coord.y - state.radius < 0) ? state.radius : getMouseCoord().y
}

/**
 * This function is used as a toggle
 * to change the status of final on the
 * state selected by the users in a given moment.
 * @returns void
 */
export function setFinalState() {
	let state = getSelectedState();
	if (!state) return
	state.end = !state.end;
}

/**
 * This function sets the selected
 * state as initial.
 * @returns void
 */
export function setInitialState() {
	let state = getSelectedState();
	if (!state) return
	getStateList().forEach(s => s.start = false)
	state.start = true;
}

/**
 * This method will look inside 
 * the global StateList for the 
 * initial state of the automata.
 */
export const getInitialState = () => getStateList().find(s => s.start) ?? null;

/**
 * This method receives an id and 
 * uses it as a key to find the corresponding
 * state in the global StateList. 
 * @param id an ID key to look for the state
 * @returns the found state
 */
export const getStateByID = (id) => getStateList().find(state => state.id == id) ?? null; 

/**
 * This method takes an ID corresponding to a state
 * and removes its transitions and the pop's
 * it from the list. 
 * @param stateID 
 * @returns 
 */
export function removeState(stateID) {
	let state_to_delete = getStateByID(stateID)
	if (!state_to_delete) return
	state_to_delete.transitionsOut.forEach(t => removeTransition(t.id)) 
	state_to_delete.transitionsIn.forEach(t => removeTransition(t.id))
	let index_of_state = getStateList().indexOf(state_to_delete)
	getStateList().splice(index_of_state, 1)
}

/**
 * This method is used when the users 
 * want to change the name of the state.
 * @param symbol 
 * @returns void
 */
export function typeStateName(symbol) {
	let state = getStateByID(selectedState().id);
	if (!state) return
	state.name = symbol == "backspace" && state.name.length > 0 
				? state.name.slice(0, state.name.length - 1)
				: state.name.length < 4 ? state.name.concat(symbol)
				: state.name 
}

/**
 * This method looks through the 
 * global StateList for a final state.
 * @returns a boolean value
 */
export const isThereFinalState = () => getStateList().find(s => s.end) ? true : false
	