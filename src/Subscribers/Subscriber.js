'use strict';

/**
 * listeners symbol
 *
 * @type {Symbol}
 * @private
 */
const _listeners = Symbol('listeners');

/**
 * Subscriber
 *
 * @description Able to subscribe one or several events to a event dispatcher
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class Subscriber {

    /**
     * Set listeners
     *
     * @param {Map.<string, Array.<string|function|Listener>>} listeners A map of events and their listeners
     */
    set listeners(listeners) {
        this[_listeners] = listeners;
    }

    /**
     * Get listeners
     *
     * @return {Map.<string, Array.<string|function|Listener>>} A map of events and their listeners
     */
    get listeners() {
        return this[_listeners];
    }

    /**
     * Subscribe events to the given dispatcher
     *
     * @param {Dispatcher} dispatcher
     *
     * @return {void}
     */
    subscribe(dispatcher){
        if(this.listeners.size == 0){
            return;
        }

        this.listeners.forEach((listeners, event) => {

            let len = listeners.length;

            for(let i = 0; i < len; i++){
                let listener = listeners[i];

                dispatcher.listen(event, listener);
            }
        });
    }
}

export default Subscriber;