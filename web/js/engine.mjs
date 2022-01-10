/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import { getStateList } from './globals/States.mjs';
import { modifyRunInfo, getRunInfo } from './globals/Run.mjs'
import { start } from './main.mjs'
import { setAlphabetRegex, getAlphabet } from './globals/Alphabet.mjs'
import { getStateByID, isThereFinalState,
		 getInitialState, resetSelectedState } from './state_actions.mjs'
import { modifyIterator, getIterator, newQueue, getQueue } from './globals/Queue.mjs'
import { array_subtraction } from '../libs/fp_extensions.mjs'


/**
 * Some sort of capsule that will store the ID of
 * each of the components the automata uses to 
 * process the input string
 */
class frameInfo {
	constructor(stateID, transitionID) {
		this.stateID = stateID;
		this.transitionID = transitionID;
	}
}

/**
* This method generates the sequence
* the automata follows when testing the 
* the input and stores it in `queue` which 
* then will become an animation.
* `This replaces the run for vgarcia.v0`
*/
export function preProcessAutomata() {
	document.getElementById("run-button").setAttribute("disabled", "disabled")
	document.getElementById("run-steps").setAttribute("disabled", "disabled")

	if (this.id === 'run-button') hideRunNormal()
	if (this.id === "run-steps") hideBySteps()

	let queue = newQueue()

	resetSelectedState({ id: -1 })

	let input = [...document.getElementById("input-word").value]
	modifyRunInfo({ ...getRunInfo(), input: input.join('') })

	let currentState = getInitialState()

	validateInput(true)

	input.forEach(char => {
		queue.push(new frameInfo(currentState.id, null))

		let currentTransition = currentState.transitionsOut
			.find(transition => transition.symbols
				.some(symbol => symbol === char))

		let nextState = currentTransition.state_dst
		queue.push(new frameInfo(null, currentTransition.id))
		currentState = nextState
	})

	queue.push(new frameInfo(currentState.id, null))
	modifyRunInfo({ ...getRunInfo(), transitionID: null, stateID: null })


	if (this.id === "run-button") {
		document.getElementById("run-steps").setAttribute("disabled", "disabled")
		document.getElementById("run-next").setAttribute("disabled", "disabled")
		document.getElementById("run-prev").setAttribute("disabled", "disabled")
		runAnimation(queue)
	}
	if (this.id === "run-steps") {
		modifyIterator(queue)
		document.getElementById("run-button").setAttribute("disabled", "disabled")
		document.getElementById("run-next").removeAttribute("disabled")
		modifyRunInfo({ ...getRunInfo(), nowRunning: true })
		modifyRunInfo({ ...getRunInfo(), currentChar: 0 })
	}
}

/**
 * This method is used when the users want to 
 * run the automata by steps. 
 * It will take a step forward in the sequencen when
 * the correct button is click
 * and a step backwards when the users click
 * on the 'previous' button. 
 * @returns void
 */
export function runBySteps() {
	if (this.id === "run-prev" && getIterator().index >= 0) {
		let { value } = getIterator().prev()
		if (value?.stateID) {
			modifyRunInfo({ ...getRunInfo(), transitionID: null })
			modifyRunInfo({ ...getRunInfo(), stateID: value?.stateID })
		}
		if (value?.transitionID || !getIterator().index && getRunInfo().currentChar > 0) {
			modifyRunInfo({ ...getRunInfo(), transitionID: value?.transitionID })
			modifyRunInfo({ ...getRunInfo(), stateID: null })
			modifyRunInfo({ ...getRunInfo(), currentChar: getRunInfo().currentChar - 1 })
		}
	}

	if (this.id === "run-next" && getIterator().index < getQueue().length) {
		let { value, done } = getIterator().next()

		if (done || getIterator().index === getQueue().length) {
			modifyRunInfo({ ...getRunInfo(), nowRunning: false })
			let endingState = getStateByID(getQueue().at(-1).stateID)
			document.getElementById("run-next").setAttribute("disabled", "disabled")
			document.getElementById("run-prev").setAttribute("disabled", "disabled")
			logResult(endingState.name, endingState.end)
			return
		} else {
			document.getElementById("run-prev").removeAttribute("disabled")
			if (value.stateID) {
				modifyRunInfo({ ...getRunInfo(), transitionID: null })
				modifyRunInfo({ ...getRunInfo(), stateID: value.stateID })
			}
			if (value.transitionID) {
				modifyRunInfo({ ...getRunInfo(), transitionID: value.transitionID })
				modifyRunInfo({ ...getRunInfo(), stateID: null })
				modifyRunInfo({ ...getRunInfo(), currentChar: getRunInfo().currentChar + 1 })
			}
		}
	}
}

/**
* This method iterates through the queue param to process 
* a nice animation of the automata running. 
* @param queue An instance of `class Queue` that contains the trail the 
* automata will follow to process the input string.
*/
export const runAnimation = (queue) => {
	modifyRunInfo({ ...getRunInfo(), nowRunning: true })
	modifyRunInfo({ ...getRunInfo(), currentChar: 0 })
	const timeSkipAmount = 800
	let timeSkipCount = 0
	queue.forEach(item => {
		setTimeout(() => {
			if (item.stateID != null) {
				modifyRunInfo({ ...getRunInfo(), transitionID: null })
				modifyRunInfo({ ...getRunInfo(), stateID: item.stateID })
			}
			if (item.transitionID != null) {
				modifyRunInfo({ ...getRunInfo(), transitionID: item.transitionID })
				modifyRunInfo({ ...getRunInfo(), stateID: null })
				modifyRunInfo({ ...getRunInfo(), currentChar: getRunInfo().currentChar + 1 })
			}
		}, timeSkipAmount * timeSkipCount++);
	})

	setTimeout(() => {
		modifyRunInfo({ ...getRunInfo(), nowRunning: false })
		let endingState = getStateByID(queue.at(-1).stateID)
		logResult(endingState.name, endingState.end);
	}, timeSkipAmount * timeSkipCount++);
}


/**
* This method verifies that every symbol of 
* the alphabet is included in the outbound 
* transitions set of every state. 
* @return A boolean value used as flag by other methods.
*/
export function isAutomataComplete() {
	const state_symbols = getStateList().map(state => state.transitionsOut.map(tr => tr.symbols).flat())
	const error =
		getStateList().reduce((prev, state, index) => {
			let exitSymbols = array_subtraction(getAlphabet(), state_symbols[index])
			if (exitSymbols.length)
				prev += `state # ${state.name} has no exit transition 
						containing the symbols ${exitSymbols}.<br>`
			return prev
		}, new String())
	if (!error.length) return error.length
	return createError("AUTOMATA NOT COMPLETE", error)
}

/**
 * This method takes the data from the alphabet input
 * and sets the alphabet using a RegEx.
 */
export function setAlphabet() {
	restart();
	const aux = document.getElementById("alphabet").value
	const regex = /[A-Za-z0-9]/g
	setAlphabetRegex([...new Set(aux.match(regex))])

}

/**
 * This method will restart the Error and Result
 * section on the screeen.
 */
export function restart() {
	document.getElementById("results").innerHTML = "";
	document.getElementById("error").innerHTML = "";
	start();
}

/**
 * This method will log the automata errors on the screen. 
 * @param error a string containing the error the automata found.
 */
export function logError(error) {
	const _error = document.getElementById("error")
	_error.innerHTML = error
}

/**
 * Given certain validation information as parameter,
 * this method will give format to the error previous 
 * to display it on screen. 
 * @param type the type of error indentified
 * @param msg the message to be displayed
 * @returns a formatted error string.
 */
export function createError(type, msg) {
	return "<b>ERROR - <i>" + type + "</i></b><br>" + msg + "<br><br>"
}

/**
 * When the automata finished its run,
 * this method will display the result on screen. 
 * Saying whether it was accepted or not. 
 */
export function logResult(final_state_name, accept) {
	const _results = document.getElementById('results')
	let txt = `<br><b>RESULTS:</b><br> [input: \"${getRunInfo().input}\", end state: \"${final_state_name}\"]`
	txt += accept ?
		' -> <span style="color:green">accepted.</span><br><br>' :
		' -> <span style="color:red">rejected.</span><br><br>'
	_results.innerHTML = txt;
	showHiddenElements()
}

/**
 * This method is the general error-seeker of the 
 * automata. It wil identify error in order to show them
 * on-screen.
 * @param running a boolean valued that changes when the users 
 * press any of the run buttons.
 * @returns a boolean value.
 */
export function validateInput(running = false) {
	let result = true
	let input = [...document.getElementById("input-word").value]
	let error = ""

	let incorrect_symbols = [...new Set(array_subtraction(input, getAlphabet()))]

	if (!getAlphabet().length) {
		error += createError("NO ALPHABET", "alphabet has not been set.")
		result = false;
	}

	if (incorrect_symbols.length && input.length) {
		error += createError("IMPOSSIBLE INPUT", "the symbols \'" +
			incorrect_symbols + "\' don't exist in the alphabet.")
		result = false;
	}

	if (!getInitialState()) {
		error += createError("NO INITIAL STATE", "automata doesn't have an initial state.")
		result = false;
	}

	if (!isThereFinalState()) {
		error += createError("NO FINAL STATE", "automata doesn't have a final state.")
		result = false;
	}

	if (isAutomataComplete()) {
		error += isAutomataComplete()
		result = false;
	}

	if (!input.length && !isAutomataComplete() && isThereFinalState() && getInitialState()) {
		error += createError("INPUT MISSING", "enter an input string to test the automata.");
		result = false;
	}

	if (result) error += createError("NONE", "automata is good to go.")

	logError(error)

	let run_button = document.getElementById("run-button")
	let run_steps = document.getElementById("run-steps")

	if (result && !running && !getRunInfo().nowRunning) {
		run_button.removeAttribute("disabled")
		run_steps.removeAttribute("disabled")
	}
	else {
		run_button.setAttribute("disabled", "disabled")
		run_steps.setAttribute("disabled", "disabled")
	}

	return result;
}


/**
 * This method will hide some DOM elements when the 
 * automata is running continuously. 
 */
const hideRunNormal = () => {
	document.getElementById("input-word").style.display = "none"
	document.getElementById("run-button").style.display = "none"
	document.getElementById("run-steps").style.display = "none"
	document.getElementById("run-prev").style.display = "none"
	document.getElementById("run-next").style.display = "none"
	document.getElementById("runSpinner").style.display = "block"
}

/**
 * This method will hide some DOM elements when the 
 * automata is running by steps.
 */
const hideBySteps = () => {
	document.getElementById("input-word").style.display = "none"
	document.getElementById("run-button").style.display = "none"
	document.getElementById("run-steps").style.display = "none"
	document.getElementById("bySteps").style.marginTop = "10%"
	document.getElementById("bySteps").style.display = "flex"
}

/**
 * This method will show the elements that were hidden when 
 * the automata was running.
 */
const showHiddenElements = () => {
	document.getElementById("input-word").style.display = "block"
	document.getElementById("run-button").style.display = "inline"
	document.getElementById("run-steps").style.display = "inline"
	document.getElementById("run-prev").style.display = "block"
	document.getElementById("run-next").style.display = "block"
	document.getElementById("runSpinner").style.display = "none"
	document.getElementById("bySteps").style.display = "none"
}