'use strict';

import Listener from '../../src/Listeners/Listener';

/**
 * Empty Listener
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class EmptyListener extends Listener{

    /**
     * @inheritDoc
     */
    handle(event, payload){
        return true;
    }
}

export default EmptyListener;