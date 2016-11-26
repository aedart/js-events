'use strict';

import Dispatcher from '../../src/Dispatcher';
import EventServiceProvider from '../../src/Providers/EventServiceProvider';
import Facade from '@aedart/js-facade';
import IoC from '@aedart/js-ioc';
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
}

export default TestHelper;