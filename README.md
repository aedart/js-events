# Js Events

Event Dispatcher for ES6

Before you continue reading, you should know that this package is heavily inspired by [Taylor Otwell's](https://github.com/taylorotwell) [Event Dispatcher](https://laravel.com/docs/master/events) in [Laravel](https://laravel.com/).
Please go read the documentation, to gain a better understanding of what a Service Container is and how they are intended to work... and please do support Laravel!

  * [How to install](#how-to-install)
  * [Quick Start](#quick-start)
    + [Prerequisite](#prerequisite)
    + [Service Provider](#service-provider)
    + [Mixin Event Dispatcher](#mixin-event-dispatcher)
    + [Listen for Events](#listen-for-events)
      - [Via Callback Listener](#via-callback-listener)
      - [Via Listener Class](#via-listener-class)
      - [Via Subscriber](#via-subscriber)
    + [Dispatch Events](#dispatch-events)
      - [Dispatch Events in the Background](#dispatch-events-in-the-background)
  * [Stop Event Propagation](#stop-event-propagation)
  * [Background Listeners](#background-listeners)
  * [Onward](#onward)
  * [Contribution](#contribution)
  * [Acknowledgement](#acknowledgement)
  * [Versioning](#versioning)
  * [License](#license)

## How to install

```console
npm install @aedart/js-events
```

## Quick Start

### Prerequisite

This package assumes that you are using an [IoC Service Container](https://github.com/aedart/js-ioc) and that you have registered the [Timer](https://github.com/aedart/js-timer) service, via a [Service Registrar](https://github.com/aedart/js-service-provider) or similar.

Please make sure that you have some prior knowledge about those packages / components before attempting to use this package.

### Service Provider

You need to register the `EventServiceProvider` before you can obtain the event dispatcher.

By default, the event dispatcher is registered as a singleton instance.

### Mixin Event Dispatcher
 
Once you have registered the event service provider, you can mixin the event `Dispatcher` into your components, by making use of [Mixwith](https://github.com/justinfagnani/mixwith.js) utility.
 
```javascript
'use strict';

import { DispatcherAware } from '@aedart/js-events'
import { mix } from '@vestergaard-company/js-mixin';

class MyApplication extends mix(Object).with(
    DispatcherAware
){
    constructor(){
        super();
    }
    
    init(){
        // Dispatcher is available as a property;
        let d = this.dispatcher;
    }
}

export default MyApplication;
```

### Listen for Events

#### Via Callback Listener

The easiest way to listen for event, is via callback listeners. Once the event is dispatched, the callback is invoked.

```javascript
'use strict';

import { DispatcherAware } from '@aedart/js-events'
import { mix } from '@vestergaard-company/js-mixin';

class MyApplication extends mix(Object).with(
    DispatcherAware
){
    // ... constructor not shown ...///
    
    init(){
        // Unique Event name or id 
        let event = 'My-Event-Id';
        
        // Callback listener
        let listener = (event, payload) => {
            // Do something when the event has occurred
            console.log(event, payload);
        }
        
        // Listen for the event
        this.dispatcher.listen(event, listener);
    }
}

export default MyApplication;
```

#### Via Listener Class

Sometimes it is more convenient to create a dedicated Listener class. This is especially true, if you have complex logic that need to be performed and you wish to encapsulate that logic separate from the rest of you application. 

**Listener Class**

```javascript
'use strict';

import { Listener } from '@aedart/js-events';

class NotifyUser extends Listener{
    
    handle(event, payload){
        alert('The ' + event + ' event has occurred');
    }
}

export default NotifyUser;
```

**Register Listener**

```javascript
'use strict';

import NotifyUser from './MyListeners/NotifyUser';
import { DispatcherAware } from '@aedart/js-events'
import { mix } from '@vestergaard-company/js-mixin';

class MyApplication extends mix(Object).with(
    DispatcherAware
){
    // ... constructor not shown ...///
    
    init(){
        // Unique Event name or id 
        let event = 'My-Event-Id';

        // Listen for the event
        this.dispatcher.listen(event, new NotifyUser());
    }
}

export default MyApplication;
```

#### Via Subscriber

If you application grows, it might make sense to group listeners. This can be achieved via a `Subscriber` class.

**Subscriber class**

```javascript
'use strict';

import NotifyUser from './MyListeners/NotifyUser';
import SaveStatus from './MyListeners/SaveStatus';
import RedirectToLogin from './MyListeners/RedirectToLogin';
import { Subscriber } from '@aedart/js-events';

class MySubscriber extends Subscriber{
    
    constructor(){
        this.listeners = new Map();
        
        // Key = event name / id
        // Value = array of listeners
        this.listeners.set('my-event-id', [
            new SaveStatus(),
            new NotifyUser()
        ]);
        
        this.listeners.set('my-other-event-id', [
            new RedirectToLogin()
        ]);        
    }
    
}

export default MySubscriber;
```

**Subscribe to the events**

```javascript
'use strict';

import MySubscriber from './Subscribers/MySubscriber';
import { DispatcherAware } from '@aedart/js-events'
import { mix } from '@vestergaard-company/js-mixin';

class MyApplication extends mix(Object).with(
    DispatcherAware
){
    // ... constructor not shown ...///
    
    init(){
        // Subscribe
        this.dispatcher.subscribe(new MySubscriber());
    }
}

export default MyApplication;
```

### Dispatch Events

To dispatch an event, you simply invoke the `fire` method on the dispatcher.

```javascript
'use strict';

import { DispatcherAware } from '@aedart/js-events'
import { mix } from '@vestergaard-company/js-mixin';

class MyApplication extends mix(Object).with(
    DispatcherAware
){
    // ... not shown ...///
    
    saveFormData(data){
        
        // Create the payload object
        let payload = {
            data: data,
            application: this
        }; 
        
        // Dispatch event
        this.dispatcher.fire('save-form-data', payload);
    }
}

export default MyApplication;
```

#### Dispatch Events in the Background

If you are not required to wait until all listeners have been handled, then you can dispatch an event in the background.
This means is that a `setTimeout` is created, with `0` delay, in which all registered listeners are handled. 

```javascript
'use strict';

import { DispatcherAware } from '@aedart/js-events'
import { mix } from '@vestergaard-company/js-mixin';

class MyApplication extends mix(Object).with(
    DispatcherAware
){
    // ... not shown ...///
    
    saveFormData(data){
        
        // Create the payload object
        let payload = {
            data: data,
            application: this
        }; 
        
        // Dispatch event in the background - we do not wait for this to finish
        this.dispatcher.fire('save-form-data', payload, true);
        
        // Do something else... code is invoked immediately
        this.lastFormData = data;
        
        // ... continue with other logic here ... ///
    }
}

export default MyApplication;
```

## Stop Event Propagation

Should you need to stop events from propagating, then your listener(s) just need to return `false`, in their handle method.

The same is true if you listeners is a callback!

```javascript
'use strict';

import { Listener } from '@aedart/js-events';

class NotifyUser extends Listener{
    
    handle(event, payload){
        
        // Stop other listeners from reacting to the event
        return false;
    }
}

export default NotifyUser;
```

## Background Listeners

Just like when you wish to dispatch events in the background, you can create listeners that process an event in the background, which is separate from the dispatching logic.

In other words, if you wish to execute "slow / time demanding" logic independently from other listeners, then you can create a `BackgroundListener`.
As soon as it is triggered, it will create a timeout via `setTimeout`, and execute it's logic after a specifiable delay. 

**Warning** Background listeners are unable to stop event propagation.

```javascript
'use strict';

import { BackgroundListener } from '@aedart/js-events';

class NotifyUser extends BackgroundListener{
    
    constructor(){
        // Set delay in milliseconds of when this listener
        // should process the event.
        this.processDelay = 500; // Optional, default is 0 (zero)
    }
    
    // Process event in the background
    // WARNING: cannot stop event propagation!
    process(event, payload){
        // ... logic not shown ...//
    }
}

export default NotifyUser;
```

## Onward

For further API reference, please review the source code.

## Contribution

Have you found a defect ( [bug or design flaw](https://en.wikipedia.org/wiki/Software_bug) ), or do you wish improvements? In the following sections, you might find some useful information
on how you can help this project. In any case, I thank you for taking the time to help me improve this project's deliverables and overall quality.

### Bug Report

If you are convinced that you have found a bug, then at the very least you should create a new issue. In that given issue, you should as a minimum describe the following;

* Where is the defect located
* A good, short and precise description of the defect (Why is it a defect)
* How to replicate the defect
* (_A possible solution for how to resolve the defect_)

When time permits it, I will review your issue and take action upon it.

### Fork, code and send pull-request

A good and well written bug report can help me a lot. Nevertheless, if you can or wish to resolve the defect by yourself, here is how you can do so;

* Fork this project
* Create a new local development branch for the given defect-fix
* Write your code / changes
* Create executable test-cases (prove that your changes are solid!)
* Commit and push your changes to your fork-repository
* Send a pull-request with your changes
* _Drink a [Beer](https://en.wikipedia.org/wiki/Beer) - you earned it_ :)

As soon as I receive the pull-request (_and have time for it_), I will review your changes and merge them into this project. If not, I will inform you why I choose not to.

## Acknowledgement

* [Taylor Otwell](https://github.com/taylorotwell), for his [Event Dispatcher](https://laravel.com/docs/master/events)

## Versioning

This package follows [Semantic Versioning 2.0.0](http://semver.org/)

## License

[BSD-3-Clause](http://spdx.org/licenses/BSD-3-Clause), Read the LICENSE file included in this package