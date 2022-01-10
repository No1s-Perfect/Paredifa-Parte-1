/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */
import {getStateByID, resetSelectedState, getSelectedState} from './state_actions.mjs'
import {_distanceFromCurve} from '../libs/jsbezier.mjs'
import {Coord}  from './globals/Coord.mjs'
import {getHoverState} from './utils/input.mjs'
import {getSelectedTransition, modifySelectedTransition,
		getInTransition, getTrList, modifyInTransition, 
		modifyNowFilling, getNowFillingSymbol, 
		addToTrList, Transition} from './globals/Transitions.mjs'
import {getTempSrc, modifyTempSrc, selectedState, modifySelectedState} from './globals/States.mjs';
import {getMouseCoord } from './globals/Mouse.mjs'
import {getAlphabet} from './globals/Alphabet.mjs'



/**
 * This method is used to create new
 * transitions.
 * @returns void
 */
export const createTransition = () => {
	let state 
	if (!getInTransition()) {
		state = getSelectedState()
		if (!state) return;
		modifyInTransition(true)
		modifyTempSrc(state)
		modifySelectedState({...selectedState(), adding_transition:true} )
	}
	else {
		state = getHoverState();
		if (!state) return;
		const trID = getTransitionBetweenStates(getTempSrc().id, state.id);
		if (trID !== -1) {
			modifySelectedTransition({...getSelectedTransition(), id: trID});
		}
		else {
			const aux = new Transition(Date.now(), getTempSrc(), state, [])
			modifyNowFilling({...getNowFillingSymbol(), now:true})
			addTransition(aux)
			modifySelectedTransition({...getSelectedTransition(), id:aux.id});
		}

		modifyInTransition(false)
		modifyTempSrc(null);
		modifySelectedState({...selectedState(), adding_transition:false} )
		resetSelectedState();
	}
}

/**
 * This method adds a newly created transition
 * to the global TransitionList
 * @param transition 
 * @returns void
 */
export const addTransition = (transition) =>addToTrList(transition);


/**
 * This method is in charge of 
 * @param tr a transiton from the global TransitionList
 * @returns boolean value
 */
export const mouseOverTransition = (tr) => {
	if (tr.state_src.id === tr.state_dst.id) {
		const offset = new Coord(tr.state_src.radius, tr.state_src.radius);

		switch (tr.cyclealignment) {
			case "topleft": default:
				break;
			case "topright":
				offset.x *= -1;
				break;
			case "bottomleft":
				offset.y *= -1;
				break;
			case "bottomright":
				offset.y *= -1;
				offset.x *= -1;
				break;
		}

		let distance = Math.abs(
						Math.sqrt(
						  Math.pow(
							  	getMouseCoord().x - 
								tr.state_src.coord.x + offset.x, 2) +
						  Math.pow(
								getMouseCoord().y - 
								tr.state_src.coord.y + offset.y, 2)
						  ) - tr.state_src.radius
					  );
	
		return distance < 8 ;	
	}


	if (tr.curve === null) return false;
	return  _distanceFromCurve(getMouseCoord(), tr.curve.curve).distance < 7;


}


/**
 * This method will look for a transition on the global
 * TransitionList given an id. 
 * @param id An id corresponding to a transition
 * @returns the found transition
 */
export const getTransitionByID = (id) => getTrList().find( tr => tr.id===id ) ?? null;


/**
 * Given a state id and a transition id
 * this method will return true or false if that
 * state contains that transition.
 * @param stateID an ID corresponding to a state
 * @param trID a transition ID
 * @returns boolean value
 */
export const stateContainsTransition = (stateID, trID) => 
	stateContainsTransitionOut(stateID, trID) || stateContainsTransitionIn(stateID, trID);


/**
 * This method will look on the state
 * if the given transition id is listed on its
 * outbound transitions. 
 * @param stateID an ID corresponding to a state
 * @param trID a transition ID
 * @returns boolean value
 */
export const stateContainsTransitionIn = (stateID, trID) => 
	getStateByID(stateID).transitionsIn.find(tr => tr.id === trID) !== undefined;

/**
 * This method will look on the state
 * if the given transition id is listed on its
 * inbound transitions. 
 * @param stateID an ID corresponding to a state
 * @param trID a transition ID
 * @returns boolean value
 */
export const stateContainsTransitionOut = (stateID, trID) =>  
	getStateByID(stateID).transitionsOut.find(tr => tr.id === trID) !== undefined;


/**
 * This method will remove the last symbol
 * the transition has.
 * @returns void
 */
export const removeLastSymbol = () => getSelectedTransition().id === -1 ? 0 
		: getTransitionByID(getSelectedTransition().id).symbols.pop();



/** Adds symbol to the selected transition only
 *  if the symbol is belongs to the ALPHABET AND
 *  the tr doesnt already have the given symbol
 * @param sym a symbol taken from a keyPress event
 */ 
export const addTransitionSymbol = (sym) => {
	if (getSelectedTransition().id == -1) return;

	const tr = getTransitionByID(getSelectedTransition().id)
	if(getAlphabet().indexOf(sym) === -1){
		var toastLiveExample = document.getElementById('liveToast')
		const toast = new bootstrap.Toast(toastLiveExample)
		toast.show()
	}
	if( (tr.state_src.transitionsOut.find(tr => tr.symbols.indexOf(sym) !== -1 ) ) !== undefined ) return;
	
	if (getAlphabet().indexOf(sym) !== -1 && tr.symbols.indexOf(sym) === -1) tr.symbols.push(sym);	
}

/** 
 * Deletes selected transition or if we delete
 * a state and the transition belongs to 
 * either trOUT or trIN it deletes the TR
 * updates selectedTransition to -1 if it
 * maches the trID
 * @param trID a transiton ID
 */ 
export const removeTransition = (trID) => {
	let transition_to_delete = getTransitionByID(trID)
	if (!transition_to_delete) return
	
	let affected_states = [transition_to_delete.state_src, transition_to_delete.state_dst]
	affected_states.forEach(state => {
		state.transitionsIn = state.transitionsIn.filter(tr => tr.id !== trID)
		state.transitionsOut = state.transitionsOut.filter(tr => tr.id !== trID)
	})
	
	let	index_of_transition = getTrList().indexOf(transition_to_delete)

	getTrList().splice(index_of_transition, 1)

	modifySelectedTransition({id:-1})

}

/**
 * Returns the symbols of the transition
 * if there is a selected one 
*/ 
export const getSymbolsTransition = (trID) => trID === -1 ? null : getTransitionByID(trID).symbols;



/**
 * Given two state ids,
 * this method will return the transition 
 * connecting those states.
 * @param fromID the id of the source state
 * @param toID the id of the destination state
*/
export const  getTransitionBetweenStates = (fromID, toID) => getStateByID(fromID).transitionsOut.find(tr => tr.state_dst.id === toID)?.id ?? -1;

/**
* Resets current selected transition, 
* if mouse click isn't the current component.
*/
export const resetSelectedTransition = () => {	
	if (getSelectedTransition().id != -1) {
		const tr = getTransitionByID(getSelectedTransition().id)
		if (getSymbolsTransition(tr.id).length == 0) {
			removeTransition(tr.id)
		}
	}
	modifySelectedTransition({id:-1})
}