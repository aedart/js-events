'use strict';

import Listener from '../../src/Listeners/Listener';

/**
 * Amount
 *
 * @type {number}
 */
let amount = 0;

/**
 * Counting Listener
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class CountingListener extends Listener{

    /**
     * Set amount
     *
     * @param {number} number The amount this has been executed
     */
    static set amount(number) {
        amount = number;
    }

    /**
     * Get amount
     *
     * @return {number} The amount this has been executed
     */
    static get amount() {
        return amount;
    }

    /**
     * @inheritDoc
     */
    handle(event, payload){

        // Increase amount called
        this.constructor.amount++;

        return true;
    }
}

export default CountingListener;