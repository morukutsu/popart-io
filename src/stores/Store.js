import alt from '../alt';
import Actions from '../actions/Actions';
import fs from 'fs';
import EffectFactory from '../popart/FX/EffectFactory';

class Store {
    constructor() {
        this.bindActions(Actions);

        this.effectList      = ["Synthesizer", "RuttEtra", "Mosaic"];
        this.effectInstances = [];

        // Focus
        this.activeEntity = 0;
    }

    addEffect(effect) {
        this.effectInstances.push(effect);
    }

    deleteEffect(effectIndex) {
        let prevNumberOfInstances = this.effectInstances.length;

        this.effectInstances.splice(effectIndex, 1);

        // Reselect the current activeEntity after the effect instances list changed
        if (effectIndex <= this.activeEntity) {
            this.activeEntity--;
        }

        if (this.activeEntity < 0) {
            this.activeEntity = 0;
        }
    }

    selectEffect(effectIndex) {
        this.activeEntity = effectIndex;
    }

    save() {
        let effectInstancesJson = JSON.stringify(this.effectInstances);
        fs.writeFile("save.json", effectInstancesJson, (err) => console.log(err));
        console.log("Content saved");
    }

    load() {
        let instances = JSON.parse(fs.readFileSync("save.json") );
        console.log(instances);

        // Clear the current list of instances
        this.effectInstances = []

        // Iterate on the list of FX instances loaded from the file
        instances.forEach((instance) => {
            // Instantiate the actual core Component
            let coreComponentName = instance.name + "Core";
            let component = EffectFactory.lookupComponentByName(coreComponentName);
            let effect = new component();

            // Set the parameter values to the instances
            effect.loadParametersValues(instance);

            // Register the component
            this.effectInstances.push(effect);
        });
    }
}

export default alt.createStore(Store, 'Store');
