/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

/** A class to create transitions */
 export class Transition{
	constructor(id, state_src, state_dst, symbols) {
		this.id = id;
		this.state_src = state_src;
		this.state_dst = state_dst;
		this.symbols = symbols;		
		state_src.transitionsOut[state_src.transitionsOut.length] = this;
		state_dst.transitionsIn[state_dst.transitionsIn.length] = this;
	}
}

/** the global transtions' List */
let transitionList = []
/**a global variable to store the current selected transition */
let selectedTransition = {id: -1}
/**a global variable to store the current hovered transition */
let hoveredTransition = null
/** a boolean value that changes if the mouse is on a transition*/
let inTransition = false
/** boolean value that indicates if the symbols of the transition 
 * are being modified. */
let nowFillingSymbol = {now: false}

/** a getter method for the current selected transition */
export const getSelectedTransition = () => selectedTransition

export const modifySelectedTransition = (newTransition) =>  selectedTransition = newTransition

/** a getter method for the global TransitionList */
export const getTrList = () => transitionList

export const modifyTransitionList = (newTransitionList) =>  transitionList = newTransitionList

export const addTransition = (newTransition) => transitionList.push(newTransition)

/** a getter method for the current hovered transition */
export const getHoveredTransition = () => hoveredTransition

export const modifyHoveredTransition = (newhoveredTransition) => hoveredTransition = newhoveredTransition

/** a method to change the boolean value if the transition is selected */
export const modifyInTransition = (newTransition) => inTransition = newTransition

/** a getter that returns a boolean whether or not the mouse is on a transition */
export const getInTransition = () => inTransition

/** 
 * A getter method for the boolean indicating 
 * if the user is changing the symbols of the transition
*/
export const getNowFillingSymbol = () => nowFillingSymbol

/**modifies the boolean value when the user is editing the symbols of the transition */
export const modifyNowFilling = (newSymbol) =>  nowFillingSymbol = newSymbol

/** add a new transition to the global TransitionList */
export const addToTrList = (tr) => transitionList.push(tr)
