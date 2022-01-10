/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

/**a global variable that matches the selected state. */
let selectedSt = {id: -1, selecting: false, 
		hovering: false, moving: false, 
		adding_transition: false, naming: false}
let stateList = []
let tempSrc = null

/**The class in charge of creating new states */
export class State {
	constructor(id, name, coord, end, start, transitionsIn, transitionsOut) {
		this.id = id
		this.name = name
		this.coord = coord
		this.radius = 20
		this.end = end
		this.start = start
		this.transitionsIn = transitionsIn
		this.transitionsOut = transitionsOut
	}
}

/**a setter method for the global selected state */
export const modifySelectedState = (newState) => selectedSt = newState

/**a getter method for the global selected state */
export const selectedState = () => selectedSt

/**
 * a getter method for the list containing all the 
 * states of the automata. 
 */
export const getStateList = () => stateList

/**
 * Modifies the globalStateList
 * @param newStateList a new list
 * @returns void
 */
export const modifyStateList = (newStateList) =>  stateList = newStateList

/**
 * A method to add new states to the 
 * global StateList
 * @param newState a new state
 * @returns 
 */
export const addToStateList = (newState) => stateList.push(newState)

/**
 * a setter method for the temporal state
 * @param tmpState a temporal state
 * @returns void
 */
export const modifyTempSrc = (tmpState) =>  tempSrc = tmpState

/**
 * a getter method for the temporal state.
 */
export const getTempSrc = () => tempSrc
