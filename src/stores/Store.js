import alt from '../alt';
import Actions from '../actions/Actions';
import fs from 'fs';

class Store {
    constructor() {
        this.bindActions(Actions);

        this.effectList      = ["Synthesizer", "RuttEtra"];
        this.effectInstances = [];
    }

    addEffect(effect) {
        this.effectInstances.push(effect);
    }

    save() {
        let effectInstancesJson = JSON.stringify(this.effectInstances);
        fs.writeFile("save.json", effectInstancesJson, (err) => console.log(err));
        console.log("Content saved");
    }

    load() {

    }
}

export default alt.createStore(Store, 'Store');
