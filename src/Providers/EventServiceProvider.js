'use strict';

import { DISPATCHER_CLASS } from './../Contracts/Services';
import Dispatcher from './../Dispatcher';
import ServiceProvider from '@aedart/js-service-provider';

/**
 * Event Service Provider
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class EventServiceProvider extends ServiceProvider{

    /**
     * Register all of this provider's services
     *
     * @return {void}
     */
    register(){
        this.ioc.singletonInstance(DISPATCHER_CLASS, Dispatcher);
    }

}

export default EventServiceProvider;