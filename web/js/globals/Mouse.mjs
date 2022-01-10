/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */


let mousePos = {x:0, y:0}
let mouseOut = false

/** a method to update the coordinates of the mouse  */
export const modifyMouseCoord = (newCoord) => mousePos = newCoord

/** a getter method for the mouse coordinate */
export const getMouseCoord = () => mousePos

/**a method to verify if the mouse is out */
export const isMouseOut = () => mouseOut

/**a method to change the "mouseOut" status */
export const modifyMouseOut = (boolean) => mouseOut = boolean