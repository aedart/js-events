'use strict';

import DispatcherAware from '../../../src/Mixins/DispatcherAware';
import Dispatcher from '../../../src/Dispatcher';
import TestHelper from '../../helpers/TestHelper';
import { mix } from 'mixwith/src/mixwith';

describe('Dispatcher Aware Mixin', function(){

    afterEach(() => {
        TestHelper.after();
    });

    /********************************************************************
     * Helpers
     *******************************************************************/

    class DummyClass extends mix(Object).with(DispatcherAware) {}

    /********************************************************************
     * Actual tests
     *******************************************************************/

    it('has null as default event dispatcher', function () {
        let dummy = new DummyClass();

        expect(dummy.dispatcher).toBeNull();
    });

    it('can get and set event dispatcher', function () {
        let dummy = new DummyClass();

        let dispatcher = TestHelper.makeDispatcher();

        dummy.dispatcher = dispatcher;

        expect(dummy.dispatcher).toBe(dispatcher);
    });

    it('returns event dispatcher, when service has been registered', function () {
        TestHelper.before();

        let dummy = new DummyClass();

        expect(dummy.dispatcher).not.toBeNull();
        expect(dummy.dispatcher instanceof Dispatcher).toBe(true);
    });
});