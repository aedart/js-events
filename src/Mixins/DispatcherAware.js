'use strict';

import { IoCFacade } from '@aedart/js-service-provider';
import { DISPATCHER_CLASS } from './../Contracts/Services';
import {DeclareMixin} from '@vestergaard-company/js-mixin';

/**
 * dispatcher symbol
 *
 * @type {Symbol}
 * @private
 */
const _dispatcher = Symbol('dispatcher');

/**
 * Dispatcher Aware Mixin
 *
 * @return {DispatcherAware}
 */
export default DeclareMixin((superClass) => class DispatcherAware extends superClass {

    /**
     * Set dispatcher
     *
     * @param {Dispatcher|null} eventDispatcher Instance of an event dispatcher
     */
    set dispatcher(eventDispatcher) {
        this[_dispatcher] = eventDispatcher;
    }

    /**
     * Get dispatcher
     *
     * @return {Dispatcher|null} Instance of an event dispatcher
     */
    get dispatcher() {
        if (!this.hasDispatcher()) {
            this.dispatcher = this.defaultDispatcher;
        }
        return this[_dispatcher];
    }

    /**
     * Check if "dispatcher" has been set
     *
     * @return {boolean}
     */
    hasDispatcher() {
        return (this[_dispatcher] !== undefined && this[_dispatcher] !== null);
    }

    /**
     * Get a default "dispatcher"
     *
     * @return {Dispatcher|null} A default "dispatcher" value or null if none is available
     */
    get defaultDispatcher() {
        return IoCFacade.make(DISPATCHER_CLASS);
    }
});