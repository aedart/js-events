'use strict';

import Dispatcher from '../../src/Dispatcher';
import EventServiceProvider from '../../src/Providers/EventServiceProvider';
import EmptyListener from './EmptyListener';
import DummyListener from './DummyListener';
import CountingListener from './CountingListener';
import Facade from '@aedart/js-facade';
import IoC from '@aedart/js-ioc';
import { TimerServiceProvider } from '@aedart/js-timer';
import faker from 'faker';

/**
 * Test Helper
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class TestHelper {

    /**************************************************
     * Before and After methods
     *************************************************/

    static before(){
        Facade.ioc = IoC;
        IoC.instances.set('ioc', IoC);

        this.timerProvider = new TimerServiceProvider(IoC);
        this.timerProvider.register();

        this.provider = new EventServiceProvider(IoC);
        this.provider.register();
    }

    static after(){
        IoC.flush();

        Facade.ioc = null;
        Facade.clearResolvedInstances();
    }

    /**************************************************
     * Helpers
     *************************************************/

    /**
     * Returns a new Event Dispatcher
     *
     * @param {Container|object|null} [ioc]
     * @param {TimeMaster|null} [timeMaster]
     *
     * @return {Dispatcher}
     */
    static makeDispatcher(ioc = null, timeMaster = null){
        return new Dispatcher(ioc, timeMaster);
    }

    /**
     * Returns a new empty Listener
     * @return {EmptyListener}
     */
    static makeEmptyListener(){
        return new EmptyListener();
    }

    /**
     * Returns a dummy listener class (not initiated)
     *
     * @return {DummyListener}
     */
    static get dummyListenerClass(){
        return DummyListener;
    }

    /**
     * Returns a listener class (not initiated)
     *
     * @return {EmptyListener}
     */
    static get listenerClass(){
        return EmptyListener;
    }

    /**
     * Returns a counting listener class (not initiated)
     *
     * @return {CountingListener}
     */
    static get countingListenerClass(){
        return CountingListener;
    }
}

export default TestHelper;