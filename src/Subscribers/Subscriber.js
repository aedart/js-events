'use strict';

/**
 * Subscriber
 *
 * @description Able to subscribe one or several events to a event dispatcher
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class Subscriber {

    /**
     * Subscribe events to the given dispatcher
     *
     * @param {Dispatcher} dispatcher
     *
     * @return {void}
     */
    subscribe(dispatcher){
        /*eslint no-unused-vars: ["error", { "args": "none" }]*/
        throw new Error('Cannot subscribe, method is abstract');
    }
}

export default Subscriber;