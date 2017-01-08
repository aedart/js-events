'use strict';

import Listener from './Listeners/Listener';
import Subscriber from './Subscribers/Subscriber';
import { TimeMasterAware } from '@aedart/js-timer';
import { IoCAware } from '@aedart/js-service-provider';
import { mix } from 'mixwith/src/mixwith';

/**
 * listeners symbol
 *
 * @type {Symbol}
 * @private
 */
const _listeners = Symbol('listeners');

/**
 * wildcard Listeners symbol
 *
 * @type {Symbol}
 * @private
 */
const _wildcardListeners = Symbol('wildcard-listeners');

/**
 * Event Dispatcher's id for dispatch
 * operations executed in the background
 *
 * @type {string}
 */
const TIMER_ID = '@aedart/js-event/Dispatcher._dispatching';

/**
 * Dispatcher
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class Dispatcher extends mix(Object).with(
    IoCAware,
    TimeMasterAware
){
    /**
     * Create new Event Dispatcher instance
     *
     * @param {Container|object|null} [ioc]
     * @param {TimeMaster|null} [timeMaster]
     */
    constructor(ioc = null, timeMaster = null){
        super();

        this.ioc = ioc;
        this.timeMaster = timeMaster;
        this.listeners = new Map();
        this.wildcardListeners = new Map();
    }

    /**
     * Set listeners
     *
     * @param {Map.<string, Set.<function|Listener>>} listeners Map of events and their associated listeners
     */
    set listeners(listeners) {
        this[_listeners] = listeners;
    }

    /**
     * Get listeners
     *
     * @return {Map.<string, Set.<function|Listener>>} Map of events and their associated listeners
     */
    get listeners() {
        return this[_listeners];
    }

    /**
     * Set wildcard Listeners
     *
     * @param {Map.<string, Set.<function|Listener>>} listeners Map of wildcard events and their associated listeners
     */
    set wildcardListeners(listeners) {
        this[_wildcardListeners] = listeners;
    }

    /**
     * Get wildcard Listeners
     *
     * @return {Map.<string, Set.<function|Listener>>} Map of wildcard events and their associated listeners
     */
    get wildcardListeners() {
        return this[_wildcardListeners];
    }

    /**
     * Register a listener for one or more events
     *
     * @param {string|Array.<string>} events
     * @param {string|function|Listener} listener
     *
     * @throws {TypeError} If listener is invalid
     */
    listen(events, listener){
        if( ! Array.isArray(events)){
            events = [ events ];
        }

        let len = events.length;
        for(let i = 0; i < len; i++){
            let event = events[i];

            if(this._containsWildcard(event)){
                // Wildcard listener
                this._setupWildcardListener(event, listener);
            } else {
                // Regular listener
                this._setupRegularListener(event, listener);
            }
        }
    }

    /**
     * Register an event subscriber
     *
     * @param {string|Subscriber} subscriber
     *
     * @throws {TypeError} If subscriber is invalid
     */
    subscribe(subscriber){
        // Resolve the subscriber
        subscriber = this.makeSubscriber(subscriber);

        // Subscribe...
        subscriber.subscribe(this);
    }

    /**
     * Dispatch an event
     *
     * @param {string} event            Event id
     * @param {object} [payload]        Payload to dispatch to listeners
     * @param {boolean} [inBackground]  If true, listeners are invoked in the background
     * @param {boolean} [halt]          If true, will stop execution on first listener that returns false
     */
    fire(event, payload = {}, inBackground = false, halt = true){
        // Dispatch regularly
        if( ! inBackground){
            this._dispatchEvent(event, payload, halt);
            return;
        }

        // Dispatch in the background
        this.timeMaster.addTimeout(TIMER_ID, () => {
            this._dispatchEvent(event, payload, halt);
            this.timeMaster.remove(TIMER_ID);
        }, 0);
    }

    /**
     * Remove all listeners for the given event
     *
     * @param {string} event
     */
    forget(event){
        if(this._containsWildcard(event)){
            this.wildcardListeners.delete(event);
        } else {
            this.listeners.delete(event);
        }
    }

    /**
     * Check if event has listeners
     *
     * @param {string} event
     *
     * @return {boolean}
     */
    hasListeners(event){
        return (this.listeners.has(event) && this.listeners.get(event).size > 0) ||
            (this.wildcardListeners.has(event) && this.wildcardListeners.get(event).size > 0);
    }

    /**
     * Returns all listeners that match the given event
     *
     * @param {string} event
     *
     * @return {Array.<function|Listener>}
     */
    getListeners(event){
        let wildcardListeners = this._getWildcardListeners(event);

        let regularListeners = (this.listeners.has(event)) ? Array.from(this.listeners.get(event)): [];

        return wildcardListeners.concat(regularListeners);
    }

    /**
     * Returns the listener, either as is or resolved from the IoC
     *
     * @param {string|function|Listener} listener
     *
     * @return {function}
     *
     * @throws {TypeError} If listener is invalid
     */
    makeListener(listener){
        // Resolve listener from IoC, if string given
        if(typeof listener === 'string'){
            listener = this.ioc.make(listener);
        }

        // If listener is a callback function or instance of Listener, all is okay
        if(listener instanceof Listener || typeof listener === 'function'){
            return listener;
        }

        // Means that something else was given... thus, we fail!
        throw new TypeError('Given listener must be a callback function or of the type "Listener"');
    }

    /**
     * Returns a subscriber instance, either as it has been given
     * or resolved from the IoC
     *
     * @param {string|Subscriber} subscriber
     *
     * @return {Subscriber}
     *
     * @throws {TypeError} If subscriber is invalid
     */
    makeSubscriber(subscriber){
        // Resolve subscriber from IoC, if string given
        if(typeof subscriber === 'string'){
            subscriber = this.ioc.make(subscriber);
        }

        // Check that subscriber is instance of Subscriber
        if(subscriber instanceof Subscriber){
            return subscriber;
        }

        // Means that something else was given... thus, we fail!
        throw new TypeError('Given subscriber must be instance of "Subscriber"');
    }

    /**
     * Dispatch an event with the given payload
     *
     * @param {string} event
     * @param {object} [payload]
     * @param {boolean} [halt]
     *
     * @private
     */
    _dispatchEvent(event, payload = {}, halt = true){
        let listeners = this.getListeners(event);
        let len = listeners.length;

        for(let i = 0; i < len; i++){
            let listener = listeners[i];

            // Execute the listener
            let result = null;
            if(listener instanceof Listener){
                result = listener.handle(event, payload);
            } else {
                result = listener(event, payload);
            }

            // If result not set...
            if(result === null || result === undefined){
                result = true;
            }

            // Stop further execution, if we must halt and the
            // listener returned "false"
            if(halt && result === false){
                break;
            }
        }
    }

    /**
     * Registers a listener for the given event
     *
     * @param {string} event
     * @param {string|function|Listener} listener
     *
     * @private
     */
    _setupWildcardListener(event, listener){
        listener = this.makeListener(listener);

        // Create listener set for event, if needed
        if( ! this.wildcardListeners.has(event)){
            this.wildcardListeners.set(event, new Set());
        }

        let listenerSet = this.wildcardListeners.get(event);

        // Prevent duplicate listener
        if(listenerSet.has(listener)){
            return;
        }

        listenerSet.add(listener);
        this.wildcardListeners.set(event, listenerSet);
    }

    /**
     * Registers a listener for the given event
     *
     * @param {string} event
     * @param {string|function|Listener} listener
     *
     * @private
     */
    _setupRegularListener(event, listener){
        listener = this.makeListener(listener);

        // Create listener set for event, if needed
        if( ! this.listeners.has(event)){
            this.listeners.set(event, new Set());
        }

        let listenerSet = this.listeners.get(event);

        // Prevent duplicate listener
        if(listenerSet.has(listener)){
            return;
        }

        listenerSet.add(listener);
        this.listeners.set(event, listenerSet);
    }

    /**
     * Check if given event contains a wildcard
     *
     * @param {string} event
     * @return {boolean}
     *
     * @private
     */
    _containsWildcard(event){
        return (event.indexOf('*') !== -1);
    }

    /**
     * Returns all wildcard listeners that match the
     * given event
     *
     * @param {string} event
     * @return {Array.<function>}
     *
     * @private
     */
    _getWildcardListeners(event){
        let matchingListeners = [];

        this.wildcardListeners.forEach((listeners, key)=>{

            // If event matches wildcard
            if(this._matchesWildcard(event, key)){
                matchingListeners =  matchingListeners.concat(Array.from(listeners));
            }
        });

        return matchingListeners;
    }

    /**
     * Check if given event matches the given wildcard event
     *
     * @param {string} event
     * @param {string} wildcard
     *
     * @return {boolean}
     *
     * @private
     */
    _matchesWildcard(event, wildcard){
        return new RegExp('^' + wildcard.split('*').join('.*') + '$').test(event);
    }
}

export default Dispatcher;