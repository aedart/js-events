'use strict';

import Listener from '../../src/Listeners/Listener';

/**
 * event symbol
 *
 * @type {Symbol}
 * @private
 */
const _event = Symbol('event');

/**
 * payload symbol
 *
 * @type {Symbol}
 * @private
 */
const _payload = Symbol('payload');

/**
 * Dummy Listener
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class DummyListener extends Listener{

    constructor(){
        super();
    }

    /**
     * Set event
     *
     * @param {string} event Event name
     */
    set event(event) {
        this[_event] = event;
    }

    /**
     * Get event
     *
     * @return {string} Event name
     */
    get event() {
        return this[_event];
    }

    /**
     * Set payload
     *
     * @param {object} payload Last event payload
     */
    set payload(payload) {
        this[_payload] = payload;
    }

    /**
     * Get payload
     *
     * @return {object} Last event payload
     */
    get payload() {
        return this[_payload];
    }

    /**
     * @inheritDoc
     */
    handle(event, payload){

        this.event = event;
        this.payload = payload;

        return true;
    }
}

export default DummyListener;