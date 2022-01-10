/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import {preProcessAutomata, setAlphabet, runBySteps} from './engine.mjs'
import {exportJson, importJson, downloadAsPNG, fetchAbout } from './importexport.mjs'
import {setDefaultAlphabet} from './globals/Alphabet.mjs'
import { wipeData } from './utils/erasing.mjs'

/**
 * This function will assign to each of the buttons
 * its corresponding handling function.
 **/
export function button_handlers() {
    document.getElementById('exportJson').addEventListener('click', exportJson)
	document.getElementById('importJson').addEventListener('click', importJson)
	document.getElementById('run-button').addEventListener('click', preProcessAutomata)
	document.getElementById('run-steps').addEventListener('click', preProcessAutomata)	
	document.getElementById('setAlphabet').addEventListener('click', setAlphabet)
	document.getElementById('download-image').addEventListener('click', downloadAsPNG)
	document.getElementById('about').addEventListener('click', fetchAbout)
	document.getElementById("run-next").addEventListener("click", runBySteps)
	document.getElementById("run-prev").addEventListener("click", runBySteps)
	document.getElementById('defaultAlphabet').addEventListener('click', setDefaultAlphabet)
	document.getElementById('confirmationDataWipe').addEventListener('click', wipeData)
}