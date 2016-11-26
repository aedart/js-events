'use strict';

import TestHelper from '../helpers/TestHelper';
import IoC from '@aedart/js-ioc';
import faker from 'faker';

describe('Dispatcher Test', function(){

    beforeEach(() => {
       TestHelper.before();
    });

    afterEach(() => {
        TestHelper.after();
    });

    /************************************************************
     * Instance creation
     ***********************************************************/

    it('can create instance', function () {
        let dispatcher = TestHelper.makeDispatcher();

        expect(dispatcher).toBeTruthy();
    });

    /************************************************************
     * Listen tests
     ***********************************************************/

    describe('manage listeners', function () {

        it('can listen for event using callback listener', function () {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word();

            let listener = () => {
                return true;
            };

            dispatcher.listen(event, listener);

            // Expect that listeners exist for event
            expect(dispatcher.hasListeners(event)).toBe(true, 'should have listeners for event');

            // Expect listener is amongst list of listeners
            let listeners = dispatcher.getListeners(event);

            expect(listeners.length).toBe(1, 'Should have a listener');
            expect(listeners[0]).toBe(listener, 'Incorrect listener returned');
        });

        it('can listen for wildcard event using callback listener', function () {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word() + '.*'; // NOTE the wildcard

            let listener = () => {
                return true;
            };

            dispatcher.listen(event, listener);

            // Expect that listeners exist for event
            expect(dispatcher.hasListeners(event)).toBe(true, 'should have listeners for event');

            // Expect listener is amongst list of listeners
            let listeners = dispatcher.getListeners(event);

            expect(listeners.length).toBe(1, 'Should have a listener');
            expect(listeners[0]).toBe(listener, 'Incorrect listener returned');
        });

        it('can listen for event using Listener class', function () {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word();

            let listener = TestHelper.makeEmptyListener();

            dispatcher.listen(event, listener);

            // Expect that listeners exist for event
            expect(dispatcher.hasListeners(event)).toBe(true, 'should have listeners for event');

            // Expect listener is amongst list of listeners
            let listeners = dispatcher.getListeners(event);

            expect(listeners.length).toBe(1, 'Should have a listener');
            expect(listeners[0]).toBe(listener, 'Incorrect listener');
        });

        it('can listen for wildcard event using Listener class', function () {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word() + '.*'; // NOTE the wildcard

            let listener = TestHelper.makeEmptyListener();

            dispatcher.listen(event, listener);

            // Expect that listeners exist for event
            expect(dispatcher.hasListeners(event)).toBe(true, 'should have listeners for event');

            // Expect listener is amongst list of listeners
            let listeners = dispatcher.getListeners(event);

            expect(listeners.length).toBe(1, 'Should have a listener');
            expect(listeners[0]).toBe(listener, 'Incorrect listener');
        });

        it('can listen for event resolving listener from the IoC', function () {
            let dispatcher = TestHelper.makeDispatcher();

            // Bind listener class
            let abstract = faker.random.uuid();
            IoC.singletonInstance(abstract, TestHelper.listenerClass);

            let event = faker.random.word();

            let listener = IoC.make(abstract);

            // Listen for event, use "string" identifier for listener
            dispatcher.listen(event, abstract);

            // Expect that listeners exist for event
            expect(dispatcher.hasListeners(event)).toBe(true, 'should have listeners for event');

            // Expect listener is amongst list of listeners
            let listeners = dispatcher.getListeners(event);

            expect(listeners.length).toBe(1, 'Should have a listener');
            expect(listeners[0]).toBe(listener, 'Incorrect listener');
        });

        it('can listen for many events, using same listener', function () {
            let dispatcher = TestHelper.makeDispatcher();

            // Bind listener class
            let abstract = faker.random.uuid();
            IoC.singletonInstance(abstract, TestHelper.listenerClass);

            let listener = IoC.make(abstract);

            let events = [
                'A',
                'B.*',
                'C',
            ];

            // Listen for multiple events
            dispatcher.listen(events, abstract);

            // Expect each event to have same listener
            expect(dispatcher.hasListeners(events[0])).toBe(true, 'A should have listeners');
            expect(dispatcher.hasListeners(events[1])).toBe(true, 'B should have listeners');
            expect(dispatcher.hasListeners(events[2])).toBe(true, 'C should have listeners');

            let listenersForA = dispatcher.getListeners(events[0]);
            expect(listenersForA[0]).toBe(listener, 'Incorrect listener for event A');

            let listenersForB = dispatcher.getListeners(events[1]);
            expect(listenersForB[0]).toBe(listener, 'Incorrect listener for event B');

            let listenersForC = dispatcher.getListeners(events[2]);
            expect(listenersForC[0]).toBe(listener, 'Incorrect listener for event C');
        });

        it('can forget listeners for event', function () {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word();

            let listener = () => {
                return true;
            };

            // Add listener
            dispatcher.listen(event, listener);

            // Forget listener
            dispatcher.forget(event);

            // Expect no listener to exist for event
            expect(dispatcher.hasListeners(event)).toBe(false, 'Should not have any listeners for event');
        });

        it('can forget listeners for wildcard event', function () {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word() + '.*'; // NOTE the wildcard

            let listener = () => {
                return true;
            };

            // Add listener
            dispatcher.listen(event, listener);

            // Forget listener
            dispatcher.forget(event);

            // Expect no listener to exist for event
            expect(dispatcher.hasListeners(event)).toBe(false, 'Should not have any listeners for event');
        });
    });

    /************************************************************
     * Dispatch (fire) tests
     ***********************************************************/

    describe('dispatch (fire) events', function () {

        it('can dispatch event for listener', function (done) {
            let dispatcher = TestHelper.makeDispatcher();

            let eventTarget = 'A';

            let eventPayload = {
                id: faker.random.uuid()
            };

            let listener = (event, payload) => {

                expect(event).toBe(eventTarget, 'Incorrect event');
                expect(payload).toBe(eventPayload, 'Incorrect payload');

                // Done...
                let x = setTimeout(() => {
                    clearTimeout(x);
                    done();
                }, 20);

                return true;
            };

            // Listen for event
            dispatcher.listen(eventTarget, listener);

            // Dispatch
            dispatcher.fire(eventTarget, eventPayload);
        });

        it('can dispatch event for wildcard listener', function (done) {
            let dispatcher = TestHelper.makeDispatcher();

            let eventToListenFor = 'A.*';
            let eventToDispatch = 'A.' + faker.random.word();

            let eventPayload = {
                id: faker.random.uuid()
            };

            let listener = (event, payload) => {

                expect(event).toBe(eventToDispatch, 'Incorrect event');
                expect(payload).toBe(eventPayload, 'Incorrect payload');

                // Done...
                let x = setTimeout(() => {
                    clearTimeout(x);
                    done();
                }, 20);

                return true;
            };

            // Listen for event
            dispatcher.listen(eventToListenFor, listener);

            // Dispatch
            dispatcher.fire(eventToDispatch, eventPayload);
        });

        it('invokes all listeners for event', function () {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word();
            let payload = {
                id: faker.random.uuid()
            };
            let amountDispatched = 0;

            // Listeners
            let listenerA = (e, p) => {

                expect(p).toBe(payload, 'Incorrect payload for listener a');
                amountDispatched++;

                return true;
            };

            let listenerB = (e, p) => {

                expect(p).toBe(payload, 'Incorrect payload for listener b');
                amountDispatched++;

                return true;
            };

            let listenerC = (e, p) => {

                expect(p).toBe(payload, 'Incorrect payload for listener c');
                amountDispatched++;

                return true;
            };

            // Listen for event
            dispatcher.listen(event, listenerA);
            dispatcher.listen(event, listenerB);
            dispatcher.listen(event, listenerC);

            // Dispatch event
            dispatcher.fire(event, payload);

            expect(amountDispatched).toBe(3, 'Incorrect amount of listeners triggered');
        });

        it('listener has correct "this" binding', function () {
            let dispatcher = TestHelper.makeDispatcher();

            // Bind listener class
            let abstract = faker.random.uuid();
            IoC.singletonInstance(abstract, TestHelper.dummyListenerClass);

            let listener = IoC.make(abstract);

            // Event and payload
            let event = faker.random.word();
            let payload = {
                id: faker.random.uuid()
            };

            // Listen for event
            dispatcher.listen(event, abstract);

            // Dispatch event
            dispatcher.fire(event, payload);

            // Expect event and payload to be set correctly
            expect(listener.event).toBe(event, 'Incorrect event on listener');
            expect(listener.payload).toBe(payload, 'Incorrect payload on listener');
        });

        it('stops event propagation, if a listener returns false in chain', function (done) {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word();

            // Listeners
            let listenerA = (e, p) => {
                return true;
            };

            let listenerB = (e, p) => {
                return true;
            };

            let listenerC = (e, p) => {
                // Done...
                let x = setTimeout(() => {
                    clearTimeout(x);
                    done();
                }, 100);

                return false;
            };

            let listenerD = (e, p) => {
                done.fail('Should not had been executed');
                return true;
            };

            // Listen for event
            dispatcher.listen(event, listenerA);
            dispatcher.listen(event, listenerB);
            dispatcher.listen(event, listenerC);
            dispatcher.listen(event, listenerD);

            // Dispatch event
            dispatcher.fire(event);
        });

        it('can dispatch events in the background', function (done) {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word();

            let amountExecuted = 0;

            // Listeners
            let listenerA = (e, p) => {
                amountExecuted++;
                return true;
            };

            let listenerB = (e, p) => {
                amountExecuted++;
                return true;
            };

            let listenerC = (e, p) => {
                amountExecuted++;
                return true;
            };

            let listenerD = (e, p) => {
                amountExecuted++;
                return true;
            };

            // Listen for event
            dispatcher.listen(event, listenerA);
            dispatcher.listen(event, listenerB);
            dispatcher.listen(event, listenerC);
            dispatcher.listen(event, listenerD);

            // Dispatch event
            dispatcher.fire(event, {}, true);

            expect(amountExecuted).toBeLessThan(4, 'Should not yet have executed all');

            let x = setTimeout(() => {
                clearTimeout(x);

                expect(amountExecuted).toBe(4, 'Incorrect amount executed');

                done();
            }, 20);
        });

        it('can dispatch events in the background, invoking Listener instances', function (done) {
            let dispatcher = TestHelper.makeDispatcher();

            let event = faker.random.word();
            let abstract = faker.random.uuid();
            let countingListenerClass = TestHelper.countingListenerClass;
            IoC.bindInstance(abstract, countingListenerClass); // NOTE: is NOT a singleton in this case!

            // Listen for event
            dispatcher.listen(event, abstract);
            dispatcher.listen(event, abstract);
            dispatcher.listen(event, abstract);
            dispatcher.listen(event, abstract);

            // Dispatch event
            dispatcher.fire(event, {}, true);

            expect(countingListenerClass.amount).toBeLessThan(4, 'Should not yet have executed all');

            let x = setTimeout(() => {
                clearTimeout(x);

                expect(countingListenerClass.amount).toBe(4, 'Incorrect amount executed');

                // Cleanup
                countingListenerClass.amount = 0;

                // Done...
                done();
            }, 20);
        });
    });

});