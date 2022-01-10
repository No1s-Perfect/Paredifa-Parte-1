/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

let alphabet = [];

/**
 * This method takes a regex as argmuent
 * and sets the alphabet.
 * @param newAlphabet takes a regex as argument and 
 * sets the alphabet according to it.
 * @returns void
 */
export const setAlphabetRegex = (newAlphabet) => alphabet = newAlphabet

/**
 * This is a getter method for the alphabet
 * @returns the global alphabet list
 */
export const getAlphabet = () => alphabet

/**
 * This method will set a default alphabet in case
 * the user forgets to create a new one.
 * @returns void
 */
export const setDefaultAlphabet = () => setAlphabetRegex(['0','1'])
    

