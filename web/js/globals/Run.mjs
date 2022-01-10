/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

/** 
 * This is a global variable in charge of the
 * automata's run
 */
let runInfo = {nowRunning: false, transitionID: null, stateID: null, input: null, currentChar: null}

/** a setter method for runInfo */
export const modifyRunInfo = (newRunInfo) => runInfo = newRunInfo

/** a getter method for runInfo */
export const getRunInfo = () => runInfo

/** sets runInfo as it were newly created. */
export const resetRunInfo = () => runInfo = 
    {nowRunning: false, transitionID: null, stateID: null, input: null, currentChar: null}
