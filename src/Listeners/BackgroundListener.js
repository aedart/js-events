'use strict';

import Listener from './Listener';
import { TimeMasterAware } from '@aedart/js-timer';
import mix from '@vestergaard-company/js-mixin';

/**
 * process Delay symbol
 *
 * @type {Symbol}
 * @private
 */
const _processDelay = Symbol('process-delay');

/**
 * process Id symbol
 *
 * @type {Symbol}
 * @private
 */
const _processId = Symbol('process-id');

/**
 * Process id prefix
 *
 * @type {string}
 */
export const PROCESS_ID_PREFIX = 'BackgroundListener._';

/**
 * Background Listener
 *
 * Processes an event in the background. Unlike a regular listener, a "background"
 * listener is NOT able to prevent event propagation!
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class BackgroundListener extends mix(Listener).with(
    TimeMasterAware
){
    /**
     * Set process Delay
     *
     * @param {number} milliseconds Delay before this listener processes it's event
     */
    set processDelay(milliseconds) {
        this[_processDelay] = milliseconds;
    }

    /**
     * Get process Delay
     *
     * @return {number} Delay before this listener processes it's event
     */
    get processDelay() {
        // Default to zero, if nothing given
        if(this[_processDelay] === undefined){
            this.processDelay = 0;
        }
        return this[_processDelay];
    }

    /**
     * Set process Id
     *
     * @param {string} identifier Listener's process identifier, used for when processing event
     */
    set processId(identifier) {
        this[_processId] = identifier;
    }

    /**
     * Get process Id
     *
     * @return {string} Listener's process identifier, used for when processing event
     */
    get processId() {
        // Set default process id, if none given
        if(this[_processId] === undefined){
            this.processId = PROCESS_ID_PREFIX + this.constructor.name + '(' + (Date.now() / 1000) + ')';
        }
        return this[_processId];
    }

    /**
     * @inheritDoc
     */
    handle(event, payload){

        // Dispatch in the background
        this.timeMaster.addTimeout(this.processId, () => {
            this.process(event, payload);
            this.timeMaster.remove(this.processId);
        }, this.processDelay);

        return true;
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
        /*eslint no-unused-vars: ["error", { "args": "none" }]*/
        throw new Error('Cannot process event, method is abstract');
    }
}

export default BackgroundListener;