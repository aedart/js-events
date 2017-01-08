'use strict';

import BackgroundListener from './../../src/Listeners/BackgroundListener';

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
 * Dummy Background Listener
 *
 * FOR TESTING ONLY...
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class DummyBackgroundListener extends BackgroundListener{

    /**
     * Set event
     *
     * @param {string} event The event
     */
    set event(event) {
        this[_event] = event;
    }

    /**
     * Get event
     *
     * @return {string} The event
     */
    get event() {
        return this[_event];
    }

    /**
     * Set payload
     *
     * @param {object} payload The event payload
     */
    set payload(payload) {
        this[_payload] = payload;
    }

    /**
     * Get payload
     *
     * @return {object} The event payload
     */
    get payload() {
        return this[_payload];
    }

    /**
     * Process the given event
     *
     * @param {string} event
     * @param {object} payload
     *
     * @return {void}
     */
    process(event, payload){
        this.event = event;
        this.payload = payload;
    }
}

export default DummyBackgroundListener;