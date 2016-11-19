'use strict';

/**
 * Listener
 *
 * @description Abstract event listener
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class Listener {

    /**
     * Handles the given event
     *
     * @param {string} event
     * @param {object} payload
     *
     * @return {boolean} If false, further event propagation is prevented
     */
    handle(event, payload){
        /*eslint no-unused-vars: ["error", { "args": "none" }]*/
        throw new Error('Cannot handle event, method is abstract');
    }
}

export default Listener;