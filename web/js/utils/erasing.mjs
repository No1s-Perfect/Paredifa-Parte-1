/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import {modifyTransitionList,
        modifyHoveredTransition,  
        modifyInTransition, modifySelectedTransition, modifyNowFilling} from '../globals/Transitions.mjs'
import {modifyStateList, getStateList, 
        modifySelectedState, modifyTempSrc} from '../globals/States.mjs';
import {cleanCanvas} from '../globals/Canvas.mjs';
import {modifyRunInfo} from '../globals/Run.mjs';

/**
 * This method is called when the
 * user wants to clear the canvas.
 * It will erease everything!
 */
export const wipeData = () => {
	if(getStateList())	{	
		cleanCanvas();
		modifyTransitionList([]);
		modifyStateList([]);
		modifySelectedState({id: -1, selecting: false, 
			hovering: false, moving: false, 
			adding_transition: false, naming: false});
		modifySelectedTransition({id: -1});
		modifyRunInfo({nowRunning: false, transitionID: null, 
			stateID: null, input: null, currentChar: null});
		modifyInTransition(false)
		modifyTempSrc(null);
		modifyNowFilling({now: false});
		modifyHoveredTransition(null)	
	}
}