/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import {getStateByID, moveStateByCursor, 
		typeStateName, setFinalState, createState,
		removeState,resetSelectedState, setInitialState,
		selectState, getSelectedState} from '../state_actions.mjs'
import {getSelectedTransition, modifySelectedTransition, 
		getTrList, getHoveredTransition, modifyHoveredTransition,
		getNowFillingSymbol,  modifyInTransition, modifyNowFilling} from '../globals/Transitions.mjs'
import {getTempSrc, modifyTempSrc, getStateList,
		selectedState, modifySelectedState} from '../globals/States.mjs';
import {getRunInfo} from '../globals/Run.mjs'
import {modifyMouseCoord, getMouseCoord, isMouseOut } from '../globals/Mouse.mjs'
import {removeTransition, removeLastSymbol, createTransition, 
		addTransitionSymbol, getSymbolsTransition, 
		resetSelectedTransition, mouseOverTransition} from '../transition_actions.mjs'
import {getAlphabet} from '../globals/Alphabet.mjs'
import {Coord} from '../globals/Coord.mjs'

/**
 * Updates mousePos, if theres not a state in the current x,y 
 * and theres a TR makes it hovers, also if theres a state
 * and moving property is true, moves the states along
 * with the cursor
*/
export const onMouseMove = (e) => {
	modifyMouseCoord(getCursorPosition(e));
	const state = getSelectedState();

	if (!getHoverState()) updateHoveredTransition()

	else modifyHoveredTransition(null)

	if (getRunInfo().nowRunning) return
	
	if (state && selectedState().moving) moveStateByCursor(state)
	
}

/**
 * On mouseDown if user is naming or info running
 * goes off the function, otherwise checks if theres
 * a state if there isnt, resets selected state,
 * else it will update the selected state 
 * and reset the selected TR is theres one
 */ 
export const onMouseDown = () => {
	const state = getHoverState();
	if (getRunInfo().nowRunning || selectedState().naming) return;
	if (state) {
		if (state != getSelectedState()) {
			selectState(state);
			resetSelectedTransition();
			modifyHoveredTransition(null);
			return;
		}
		else {
			resetSelectedState();
			return;
		}
	}
	else resetSelectedState(); 

	if (getHoveredTransition() !== null) 
		modifySelectedTransition({id: getHoveredTransition().id})
	
	else resetSelectedTransition(); 
}

/**
 * on MouseUp updates moving state to false
 */ 
export const onMouseUp = () => modifySelectedState({...selectedState(), moving: false});

/**
 * If theres a selected transition or a selected state
 * AND the key pressed is enter handles the naming 
 * of selected TR or selected state, otherwise chooses
 * what method to do call on the key pressed by the user
 */ 
export const onKeyPress = (e) => {
	if (isMouseOut()) return;
	if (!getAlphabet().length) {	
		new bootstrap.Modal(document.getElementById('staticBackdrop2'), {keyboard: false}).show();
		return;
	}
	if (getRunInfo().nowRunning) return;
	if (selectedState().id === -1 && e.key==='r') return;

	const key = e.keyCode || e.which || 0;
	if (getSelectedTransition().id != -1) {
		if (key === 13) { 
			modifyNowFilling({...getNowFillingSymbol(), now:false})
			if (getSymbolsTransition(getSelectedTransition().id).length == 0) {
				removeTransition(getSelectedTransition().id);
			}
			
			modifySelectedTransition({...getSelectedTransition(), id:-1})
			return;
		}

		const symbol = String.fromCharCode(key);
		addTransitionSymbol(symbol);
		return;
	}
	if (selectedState().id !== -1 && selectedState().naming) {
		if (key === 13) { //enter
			if (getStateByID(selectedState().id).name.length == 0) {
				return; //dont let the user name a state null
			}
			modifySelectedState({...selectedState(), naming:false})
			resetSelectedState();
			return;
		}
		const symbol = String.fromCharCode(key);
		typeStateName(symbol);
		return;
	}

	switch (key) {
		case 113: 
			createState();
			break;
		case 101:
			createTransition();
			break;
		case 102:
			setFinalState();
			break;
		case 115:
			setInitialState();
			break;
		case 114:
			nameState();
			break;
	}
}

/**
 * If theres a selected transition or a
 * selected state handles: naming or deleting
 */
export const onKeyDown = (e) => {
	if (getRunInfo().nowRunning ) return;
	if (selectedState().id === -1 && e.key === 'r') return;
	const key = e.keyCode || e.which || 0;
	if (getSelectedTransition().id != -1) {
		if (key === 8) {
			removeLastSymbol();
			return;
		}
		if (key === 46) {
			removeTransition(getSelectedTransition().id)			
			return;
		}
	}

	if (selectedState().id != -1) {
		if (key === 46) {
			removeState(selectedState().id);
			modifySelectedState({id: -1, selecting: false,
				hovering: false, moving: false, 
				adding_transition: false, naming: false});
			if(getTempSrc()!==null) {
				modifyTempSrc(null)
				modifyInTransition(false)
			}
			return;
		}
		if (key === 8 && selectedState().naming) {
			typeStateName("backspace");
			return;
		}
	}
}

/**
 * Receives a mouse event and generate a
 * new coordenate based on the position of 
 * the mouse. 
 * @param e A mouse event
 * @returns a new Coord instance
 */
export const getCursorPosition = (e) => ( new Coord( e.offsetX, e.offsetY ) );

/**
 * to check whether the current mouse coord in on a state 
 */ 
export const isMouseOverState = (state) => 
	(Math.sqrt( Math.pow(getMouseCoord().x - state.coord.x, 2) +
	Math.pow(getMouseCoord().y - state.coord.y, 2) ) < state.radius);
	
/**
 * finds which state is being hovered at the moment
 */ 
export const getHoverState = () => getStateList().find(state => isMouseOverState(state) ) ?? null;

/**
 * Finds if there is a transition in the 
 * current mouse position to make it hovered
 */ 
export const updateHoveredTransition = () => 
	modifyHoveredTransition(getTrList().find(tr => mouseOverTransition(tr) ) ?? null);


/**
 * To check whether the current 
 * mouse coord in on the hovered state
 */ 
export const isHoveredState = (state) => 
	(Math.sqrt(Math.pow(getMouseCoord().x - state.coord.x, 2) + 
	Math.pow(getMouseCoord().y - state.coord.y, 2)) < state.radius); 
	
/**
 * Sets the selected state currently naming
*/ 
export const nameState = () =>  modifySelectedState({...selectedState(), naming:true});
