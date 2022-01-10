/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 */

/** A very special iterator for a very 
 * special array version.
 */
class QueueIterator {
    #queue
    #index
    constructor(queue){   
        this.#queue = queue
        this.#index = -1
    }

    reset(){ this.#index = -1 }

    next(){
        return this.#index < this.#queue.length-1 ?
            { value: this.#queue[++this.#index], done: this.#index >= this.#queue.length }
            : {value: undefined, done: true} 
    }

    get index() { return this.#index } 

    prev(){
        return this.#index > 0 ? { value: this.#queue[--this.#index], done: this.#index < 0 }
            : {value: undefined, done: true} 
    }
}

/** 
 * An adapted version of the JS array
 * will allow the user to go "back in time"
 * when using the automata.
 */
export class Queue extends Array{
    constructor(){
        super();
    }
    [Symbol.iterator](){
        return new QueueIterator(this)
    }

}

/** global variable for the automata's queue */
let queue = new Queue()
/** global variable for the automata's iterator */
let _queueIterator = queue[Symbol.iterator]()

/** setter method for the iterator */
export const modifyIterator = (newQueue) => _queueIterator = newQueue[Symbol.iterator]()

/**getter method for the automata's queue */
export const getIterator = () => _queueIterator

/**creates a new queue instance */
export const newQueue = () => queue = new Queue()

/**returns the current queue instance */
export const getQueue = () => queue


