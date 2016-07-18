import alt from '../alt';
import Actions from '../actions/Actions'

class Store {
    constructor() {
        this.bindActions(Actions);

        this.effectList      = ["Synthesizer", "RuttEtra"];
        this.effectInstances = [];
    }

    addEffect(effect) {
        this.effectInstances.push(effect);
    }
}

export default alt.createStore(Store, 'Store');
