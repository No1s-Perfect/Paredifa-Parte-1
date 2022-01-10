/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

import {getStateByID, isSelected} from '../state_actions.mjs'
import {Coord} from '../globals/Coord.mjs'
import {isHoveredState, getHoverState} from '../utils/input.mjs'
import {getSelectedTransition, getTrList, 
        getHoveredTransition} from '../globals/Transitions.mjs'
import {getStateList, selectedState} from '../globals/States.mjs';
import {getMouseCoord} from '../globals/Mouse.mjs'
import {getRunInfo} from '../globals/Run.mjs'
import {st_idle_fill_color, st_idle_stroke_color,
        st_selected_fill_color,  st_selected_stroke_color,
        st_hover_fill_color, st_hover_stroke_color,
        st_run_fill_color, st_run_stroke_color,
        st_transition_fill_color, st_transition_stroke_color,
        tr_selected_color, tr_hovered_color, tr_idle_color,
        tr_run_color, text_color} from '../globals/Colors.mjs'
import {cleanCanvas, getContext} from '../globals/Canvas.mjs';


/**
 * This class is used to create the arcs
 * on the transition and make them look 
 * curve instead of straight
 */
 class Bezcurve {
	constructor(start, coord1, coord2, end) {
		let curve = []
		curve.push(start)
		curve.push(coord1)
		curve.push(coord2)
		curve.push(end)
		this.curve = curve
	}
}

 /**
 * This method is cin charge of drwaing 
 * all the components on the canvas, changing colors
 * and the aspect overall. Makes everything
 * look nice for the users. 
 */
export function draw() {
	cleanCanvas()
	getTrList().forEach(transition => drawTransition(getContext(), transition))
    if (selectedState().adding_transition) drawTempTransition(getContext())
	getStateList().forEach(state => drawState(getContext(), state))
	drawRunText(getContext())
}

/**
 * This method will make the states of the global
 * StateList appear on the screen. 
 * @param ctx the visual layer of the canvas
 * @param state a state from the globla StateList
 */
function drawState(ctx, state) {
	ctx.beginPath()
	ctx.arc(state.coord.x,
		state.coord.y,
		state.radius,
		0,
		Math.PI * 2,
		false)

	setStateColor(ctx, state)
	ctx.fill()

	setStateStroke(ctx, state)
	ctx.stroke()

	drawStateID(ctx, state)

	if (state.end) {
		ctx.beginPath()
		ctx.arc(state.coord.x,
			state.coord.y,
			state.radius * 10 / 8,
			0,
			Math.PI * 2,
			false)
		ctx.stroke()
	}

	if (state.start) {
		ctx.font = "20px Georgia"
		ctx.textAlign = "right"
		ctx.textBaseline = "middle"
		ctx.fillStyle = text_color
		ctx.fillText("I ==>",
			state.coord.x - state.radius,
			state.coord.y)
	}
}

/**
 * This method will display the state name
 * in the center of the its circle. 
 * @param ctx the visual layer of the canvas
 * @param state a state from the global StateList
 */
function drawStateID(ctx, state) {
	setFillingSymbol(ctx, state, null)

	ctx.font = "15px Georgia"
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"
	ctx.fillStyle = text_color
	ctx.fillText(state.name,
		state.coord.x,
		state.coord.y)
}

/**
 * This method will chance the circle fill color 
 * of the state matching it current status on the
 * program. 
 * @param ctx the visual layer of the canvas
 * @param state a state from the global StateList
 */
function setStateColor(ctx, state) {
	setFillingSymbol(ctx, state, null);

	ctx.fillStyle = 
	getRunInfo().nowRunning && getRunInfo().stateID == state.id ? st_run_fill_color
	: isSelected(state) && selectedState().adding_transition ? st_transition_fill_color
	: isSelected(state) && !selectedState().adding_transition ? st_selected_fill_color
	: isHoveredState(state) ? st_hover_fill_color
	: st_idle_fill_color

}

/**
 * This method is in charge if the border of each 
 * of the state circles
 * @param ctx the visual layer of the canvas
 * @param state a state from the global StateList
 */
function setStateStroke(ctx, state) {
	setFillingSymbol(ctx, state, null)

	ctx.strokeStyle =
	getRunInfo().nowRunning && getRunInfo().stateID == state.id ? st_run_stroke_color
	: isSelected(state) && selectedState().adding_transition ?  st_transition_stroke_color
	: isSelected(state) && !selectedState().adding_transition ? st_selected_stroke_color
	: isHoveredState(state) ? st_hover_stroke_color
	: st_idle_stroke_color
}

/**
 * This method is in charge of displaying the transitions
 * on the screen. 
 * @param ctx the visual layer of the canvas
 * @param tr a transition from the global TransitionList
 */
function drawTransition(ctx, tr) {
	setFillingSymbol(ctx, null, tr)

	setTransitionColor(ctx, tr)

	if (tr.state_src.id == tr.state_dst.id)	drawTransitionCircle(ctx, tr)
	
	else drawTransitionOver(ctx, tr)
}

/**
 * This method will change the color of the transition
 * depending on its status on the program. 
 * @param ctx the visual layer of the canvas
 * @param tr a transition from the global TransitionList
 */
function setTransitionColor(ctx, tr) {
	setFillingSymbol(ctx, null, tr)

	ctx.strokeStyle = ctx.fillStyle =
		(getRunInfo().nowRunning && getRunInfo().transitionID == tr.id) ? tr_run_color 
		: (getSelectedTransition().id != -1 && getSelectedTransition().id == tr.id) ? tr_selected_color 
		: (getHoveredTransition()?.id == tr.id && !getRunInfo().nowRunning) ? tr_hovered_color 
		: tr_idle_color
}

/**
 * This method will change the opacity of 
 * the canvas if it finds the user is creating a transition.
 * @param ctx the visual layer of the canvas
 * @param a_state a state from the global StateList
 * @param a_transition a transition from the global TransitionList
 */
function setFillingSymbol(ctx, a_state, a_transition) {

	ctx.globalAlpha = 
		(getSelectedTransition()?.id != -1 
		&& a_transition?.id !== getSelectedTransition()?.id) ||
	 	(selectedState()?.id != -1 && selectedState()?.naming 
		&& a_state?.id !== selectedState()?.id) ? 0.3
		: 1
}

/**
 * When a state has a transition with the shape of a 
 * loop, this circle needs to be drawn in a 
 * very special way for it to not overlap with the
 * rest of the components. 
 * @param ctx the visual layer of the canvas
 * @param tr a transition from the global TransitionList
 */
function drawTransitionCircle(ctx, tr) {
	let center = new Coord(tr.state_src.coord.x, tr.state_src.coord.y)
	let arrow_p1 = new Coord(0, 0)
	let arrow_p2 = new Coord(0, 0)
	let arrow_p3 = new Coord(0, 0)

	let radius = tr.state_src.radius

	let possiblePlace = { topleft: true, topright: true, bottomleft: true, bottomright: true }

	tr.state_src.transitionsOut.forEach(transition => {
		if (transition.state_src.coord.x < tr.state_src.coord.x &&
			transition.state_src.coord.y < tr.state_src.coord.y)
			possiblePlace.topleft = false

		if (transition.state_src.coord.x > tr.state_src.coord.x &&
			transition.state_src.coord.y < tr.state_src.coord.y)
			possiblePlace.topright = false

		if (transition.state_src.coord.x < tr.state_src.coord.x &&
			transition.state_src.coord.y > tr.state_src.coord.y)
			possiblePlace.bottomleft = false

		if (transition.state_src.coord.x > tr.state_src.coord.x &&
			transition.state_src.coord.y > tr.state_src.coord.y)
			possiblePlace.bottomright = false
	})

	ctx.font = "15px Georgia";

	if (possiblePlace.topleft) {
		center 	 = new Coord(tr.state_src.coord.x - radius, tr.state_src.coord.y - radius)
		arrow_p1 = new Coord(tr.state_src.coord.x, tr.state_src.coord.y - radius)
		arrow_p2 = new Coord(arrow_p1.x - radius / 3 - 2, arrow_p1.y - radius / 2)
		arrow_p3 = new Coord(arrow_p1.x + radius / 3 - 3, arrow_p1.y - radius / 2 - 3)

		tr.cyclealignment = "topleft"
		ctx.textAlign = "right"
		ctx.textBaseline = "top"
		ctx.fillText(tr.symbols, center.x - radius - 2, center.y - radius / 2)
	}

	else if (possiblePlace.topright) {
		center = new Coord(tr.state_src.coord.x + radius, tr.state_src.coord.y - radius)
		arrow_p1 = new Coord(tr.state_src.coord.x, tr.state_src.coord.y - radius)
		arrow_p2 = new Coord(arrow_p1.x + radius /  3 + 2, arrow_p1.y - radius / 2)
		arrow_p3 = new Coord(arrow_p1.x - radius / 3 + 3, arrow_p1.y - radius / 2 - 3)

		tr.cyclealignment = "topright"

		ctx.textAlign = "left"
		ctx.textBaseline = "top"
		ctx.fillText(tr.symbols, center.x + radius + 2, center.y - radius / 2)
	}
	else if (possiblePlace.bottomleft) {
		center = new Coord(tr.state_src.coord.x - radius, tr.state_src.coord.y + radius)
		arrow_p1 = new Coord(tr.state_src.coord.x, tr.state_src.coord.y + radius)
		arrow_p2 = new Coord(arrow_p1.x - radius / 3 - 2, arrow_p1.y + radius / 2)
		arrow_p3 = new Coord(arrow_p1.x + radius / 3 - 3, arrow_p1.y + radius / 2 + 3)

		tr.cyclealignment = "bottomleft"

		ctx.textAlign = "right"
		ctx.textBaseline = "top"	
		ctx.fillText(tr.symbols, center.x - radius - 2, center.y - radius / 2)
	}
	else {
		center = new Coord(tr.state_src.coord.x + radius, tr.state_src.coord.y + radius)
		arrow_p1 = new Coord(tr.state_src.coord.x, tr.state_src.coord.y + radius)
		arrow_p2 = new Coord(arrow_p1.x + radius / 3 + 2, arrow_p1.y + radius / 2)
		arrow_p3 = new Coord(arrow_p1.x - radius / 3 + 3, arrow_p1.y + radius / 2 + 3)

		tr.cyclealignment = "bottomright"

		ctx.textAlign = "left"
		ctx.textBaseline = "top"
		ctx.fillText(tr.symbols, center.x + radius + 2,	center.y - radius / 2)
	}

	ctx.beginPath()

	ctx.arc(center.x, center.y, radius,	0, Math.PI * 2,	false)

	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(arrow_p1.x, arrow_p1.y)
	ctx.lineTo(arrow_p2.x, arrow_p2.y)
	ctx.lineTo(arrow_p3.x, arrow_p3.y)
	ctx.closePath()
	ctx.fill()

	ctx.font = "15px Georgia"
}

/**
 * If the transition is not a loop, then
 * it will be drawn using this method. 
 * @param ctx the visual layer of the canvas
 * @param tr a transition from the global TransitionList
 */
function drawTransitionOver(ctx, tr) {
	ctx.beginPath()

	let src = new Coord(tr.state_src.coord.x, tr.state_src.coord.y)

	let dst = new Coord(tr.state_dst.coord.x, tr.state_dst.coord.y)

	let aux_angle = Math.atan2(dst.y - src.y, dst.x - src.x)
	let multiplier = tr.state_src.radius
	dst.x = dst.x - Math.cos(aux_angle) * multiplier
	dst.y = dst.y - Math.sin(aux_angle) * multiplier
	src.x = src.x + Math.cos(aux_angle) * multiplier
	src.y = src.y + Math.sin(aux_angle) * multiplier

	let vector2_dir = new Coord(dst.x - src.x,	dst.y - src.y)
		vector2_dir = normalizeVector(vector2_dir)
		vector2_dir = multiplyVector(vector2_dir, 20)

	let middle_pt1 = new Coord(src.x + (dst.x - src.x) / 3, src.y + (dst.y - src.y) / 3)

	let middle_pt2 = new Coord(src.x + 2 * (dst.x - src.x) / 3, src.y + 2 * (dst.y - src.y) / 3)

	let vector2_ort = new Coord(src.y - dst.y, dst.x - src.x)

	vector2_ort = normalizeVector(vector2_ort)
	vector2_ort = multiplyVector(vector2_ort, 7.5)


	let aux_mlt = Math.sqrt(Math.pow(dst.x - src.x, 2) + Math.pow(dst.y - src.y, 2)) / 40

	let quadPoint1 = new Coord(middle_pt1.x + vector2_ort.x * aux_mlt,
		middle_pt1.y + vector2_ort.y * aux_mlt)

	let quadPoint2 = new Coord(middle_pt2.x + vector2_ort.x * aux_mlt,
		middle_pt2.y + vector2_ort.y * aux_mlt)

	//line
	ctx.moveTo(src.x, src.y)
	ctx.bezierCurveTo(quadPoint1.x,
		quadPoint1.y,
		quadPoint2.x,
		quadPoint2.y,
		dst.x,
		dst.y)

	tr.curve = new Bezcurve(src, quadPoint1, quadPoint2, dst)

	ctx.stroke()

	//arrow
	ctx.beginPath()


	let arrowAngle = Math.atan2(quadPoint2.x - dst.x, quadPoint2.y - dst.y) + Math.PI
	let arrowWidth = 13

	ctx.moveTo(dst.x - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)),
		dst.y - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))

	ctx.lineTo(dst.x, dst.y)

	ctx.lineTo(dst.x - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)),
		dst.y - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))

	ctx.fill()

	let text_pos = new Coord(0, 0)
	text_pos = new Coord(src.x + (dst.x - src.x) / 2 + vector2_ort.x * aux_mlt,
		src.y + (dst.y - src.y) / 2 + vector2_ort.y * aux_mlt)

	if (Math.abs(src.y - dst.y) < 40) {
		if (src.x < dst.x) {
			ctx.textAlign = "center"
			ctx.textBaseline = "top"
		}
		else {
			ctx.textAlign = "center"
			ctx.textBaseline = "bottom"
		}
	}
	else {
		if (src.y < dst.y) {
			ctx.textAlign = "right"
			ctx.textBaseline = "middle"
		}
		else {
			ctx.textAlign = "left"
			ctx.textBaseline = "middle"
		}
	}

	//symbol
	ctx.font = "15px Georgia"
	ctx.fillText(tr.symbols,
		text_pos.x,
		text_pos.y)
}


/**
 * This method draws a temporary transition
 * before creating a real one. 
 * @param ctx the visual layer of the canvas
 * @returns void
 */
function drawTempTransition(ctx) {
	let state = getStateByID(selectedState().id)
	if (state === null) {
		return
	}

	ctx.strokeStyle = ctx.fillStyle = tr_idle_color

	let src = new Coord(state.coord.x, state.coord.y)
	let dst = new Coord(getMouseCoord().x, getMouseCoord().y)

	let aux_angle = Math.atan2(dst.y - src.y, dst.x - src.x)
	let multiplier = state.radius
	dst.x = dst.x - Math.cos(aux_angle) * multiplier
	dst.y = dst.y - Math.sin(aux_angle) * multiplier
	src.x = src.x + Math.cos(aux_angle) * multiplier
	src.y = src.y + Math.sin(aux_angle) * multiplier

	let vector2_dir = new Coord(dst.x - src.x, dst.y - src.y)
	vector2_dir = normalizeVector(vector2_dir)
	vector2_dir = multiplyVector(vector2_dir, 20)

	let middle_pt1 = new Coord(src.x + (dst.x - src.x) / 3,
		src.y + (dst.y - src.y) / 3)

	let middle_pt2 = new Coord(src.x + 2 * (dst.x - src.x) / 3,
		src.y + 2 * (dst.y - src.y) / 3)

	let vector2_ort = new Coord(src.y - dst.y,
		dst.x - src.x)
	vector2_ort = normalizeVector(vector2_ort)
	vector2_ort = multiplyVector(vector2_ort, 7.5)



	let aux_mlt = Math.sqrt(Math.pow(dst.x - src.x, 2) + Math.pow(dst.y - src.y, 2)) / 40

	let quadPoint1 = new Coord(middle_pt1.x + vector2_ort.x * aux_mlt,
		middle_pt1.y + vector2_ort.y * aux_mlt)

	let quadPoint2 = new Coord(middle_pt2.x + vector2_ort.x * aux_mlt,
		middle_pt2.y + vector2_ort.y * aux_mlt)

	//line
	ctx.moveTo(src.x, src.y)
	ctx.bezierCurveTo(quadPoint1.x,
		quadPoint1.y,
		quadPoint2.x,
		quadPoint2.y,
		dst.x,
		dst.y)

	if (getHoverState() == null) {
		ctx.globalAlpha = 0.3
	}
	else {
		if (getHoverState().id === state.id) {
			ctx.beginPath()
			ctx.globalAlpha = 0.3
			ctx.arc(state.coord.x - state.radius,
				state.coord.y - state.radius,
				state.radius,
				0,
				Math.PI * 2,
				false)
			ctx.stroke()

			let arrow_p1 = new Coord(state.coord.x,
				state.coord.y - state.radius)
			let arrow_p2 = new Coord(arrow_p1.x - state.radius / 3 - 2,
				arrow_p1.y - state.radius / 2)
			let arrow_p3 = new Coord(arrow_p1.x + state.radius / 3 - 3,
				arrow_p1.y - state.radius / 2 - 3)
			ctx.beginPath()
			ctx.moveTo(arrow_p1.x, arrow_p1.y)
			ctx.lineTo(arrow_p2.x, arrow_p2.y)
			ctx.lineTo(arrow_p3.x, arrow_p3.y)
			ctx.closePath()
			ctx.fill()
			return
		}
	}

	ctx.stroke()

	ctx.beginPath()

	let arrowAngle = Math.atan2(quadPoint2.x - dst.x, quadPoint2.y - dst.y) + Math.PI
	let arrowWidth = 13

	ctx.moveTo(dst.x - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)),
		dst.y - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))

	ctx.lineTo(dst.x, dst.y)

	ctx.lineTo(dst.x - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)),
		dst.y - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))

	ctx.fill()
}



/**
 * This method is used to make adjustments
 * to the coordenates by applying a 
 * some trigonometry to the given coordenate
 * @param vec a coordenate instance
 * @returns a new Coord instance
 */
function normalizeVector(vec) {
	let aux = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2))
	return new Coord(vec.x / aux, vec.y / aux)
}

/**
 * This method is used to make adjustments
 * to the coordenates
 * @param vec a coordenate instance
 * @param value a value to multiply the components of 
 * the given coordenate
 * @returns a new Coord instance
 */
export function multiplyVector(vec, value) {
	return new Coord(vec.x * value, vec.y * value)
}

/**
 * This method will take the input string to 
 * test the automata and will display it 
 * inside the canvasa.
 */
export function drawRunText(ctx) {
	if (!getRunInfo().nowRunning) return
	
	ctx.textAlign = "left"
	ctx.textBaseline = "top"
	ctx.font = "40px Georgia"
	
	let x = 0;
	let start_pos = new Coord(0, 0);
	
	[...getRunInfo().input].forEach((ch, index) => {
		ctx.fillStyle = 
			(index < getRunInfo().currentChar) ? "rgb(169, 78, 234)" : "black"
		ctx.fillText(ch, start_pos.x + x, start_pos.y);
		x += ctx.measureText(ch).width;
	})
}
