/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import {getStateByID} from './state_actions.mjs'
import {setAlphabet} from './engine.mjs';
import {stateContainsTransition} from './transition_actions.mjs'
import {getTrList, modifyTransitionList, Transition} from './globals/Transitions.mjs'
import {modifyStateList, getStateList} from './globals/States.mjs';
import {getAlphabet} from './globals/Alphabet.mjs'

/**
 * This is a class used by the JSON Methods to 
 * store and process the automata as a JSON.
 */
export class Serialized_state{
	constructor(id, name, coord, radius, end, start){
		this.id = id;
		this.name = name;
		this.coord = coord;
		this.radius = radius;
		this.end = end;
		this.start = start;
	}
}

/**
 * This is a class is also used by the JSON Methods to 
 * store and process the automata as a JSON.
 */
export class Serialized_transition{
	constructor(id, state_src_id, state_dst_id, symbols){
		this.id = id;
		this.state_src_id = state_src_id;
		this.state_dst_id = state_dst_id;
		this.symbols = symbols;
	}
}


/**
 * This method takes the value of the JSON input field on the 
 * DOM and sets the new automata using that data. 
 * @returns void
 */
export const importJson = () => setJson(document.getElementById("json-area").value);


/**
 * This method will create a new automata
 * using the data taken from the JSON input field.
 * @param json a string describing a JSON file
 */
export const setJson = (json) => {
	if (json?.length) {
		json = JSON.parse(json);
		document.getElementById("alphabet").value = json.alphabet;
		setAlphabet();

		modifyStateList( json.states.map(state => ( {...state, transitionsIn: [],  transitionsOut: [] } ) ) );

		modifyTransitionList(json.transitions.map(jsonTr=> {
			const state_src = getStateByID(jsonTr.state_src_id);
			const state_dst = getStateByID(jsonTr.state_dst_id);

			const tr = new Transition(jsonTr.id,
				state_src,
				state_dst,
				jsonTr.symbols);

			if ( !stateContainsTransition(state_src.id, tr.id) ) state_src.transitionsOut.push(tr);
			if ( !stateContainsTransition(state_dst.id, tr.id) ) state_dst.transitionsIn.push(tr);
			return tr;
		}))
	}
}


/**
 * This method will take the automata on canvas 
 * and transform it into a JSON string. 
 * @returns a JSON stringified string
 */
export const getJson = () => {
	const json_states = getStateList()
		.map(state=> new Serialized_state(
			state.id,
			state.name,
			state.coord,
			state.radius,
			state.end,
			state.start) 
		);

	const json_transitions = getTrList()
		.map(transition => new Serialized_transition(
			transition.id,
			transition.state_src.id,
			transition.state_dst.id,
			transition.symbols) 
		)

	const json = { alphabet: getAlphabet(), states: json_states,  transitions: json_transitions }
	
	return JSON.stringify(json);
}

/**
 * This method will load the automada on canvas as a 
 * JSON string in the JSON input field.
 * @returns void
 */
export const exportJson = () => document.getElementById("json-area").value = getJson();

/**
 * This method will take the automata on canvas
 * and will export it as a PNG image. When pressing the 
 * corresponding button. 
 */
export const downloadAsPNG = () => {
	let canvas_img = document.getElementById("main-canvas").toDataURL("image/png")
	let xhr = new XMLHttpRequest()
	xhr.responseType = 'blob'
	xhr.onload = () => {
		let a = document.createElement('a')
		a.href = window.URL.createObjectURL(xhr.response)
		a.download = `automata_${Date.now()}.png`
		a.style.display = 'none'
		document.body.appendChild(a)
		a.click()
		a.remove()
	}
	xhr.open('GET', canvas_img)	
	xhr.send()
}


/**
 * This method will gather the information from
 * the about.json file and then it will 
 * display it on screen. 
 */
export const fetchAbout = async () => {
	const about_div = document.getElementById('offcanvas-body')
	if (about_div.innerHTML.length) return

	const res = await fetch('./data/about.json');
    const data = await res.json()
    about_div.innerHTML+=`
		<div>
			<strong><p>${data.course.college}</p></strong>
			<strong><p>${data.course.id} - ${data.course.name}</p></strong>
			<strong><p>Profesor: ${data.course.professor}</p></strong>
			<p>${data.term.id} Term ${data.term.year}</p>
			
			<p>Team: ${data.team.id}</p></br>
			<p>Authors: </p>
		</div>
		<div class="teamInfo" id="teamInfo"></div>`

  	data.authors.forEach((author) => {
		document.getElementById('teamInfo').innerHTML+=`
		
				${author.name} ${author.id}</br>
				</br>`
  	})
  	document.getElementById('teamInfo').innerHTML+=`
    </br>
  	Version 1.0`
}