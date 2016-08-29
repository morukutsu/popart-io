import alt           from '../alt';
import Actions       from '../actions/Actions';
import fs            from 'fs';

class Store {
    constructor() {
        this.bindActions(Actions);

        this.effectList      = ["Synthesizer", "RuttEtra", "Mosaic"];
        this.effectInstances = [];

        this.modulatorsList      = ["LFO"];
        this.modulatorsInstances = [];

        // Focus
        this.lastSelectedEntityType = 'effect';
        this.activeEntity      = 0;
        this.activeModulator   = 0;
        this.selectedParameter = null;
    }

    addEffect(effect) {
        this.effectInstances.push(effect);
        //this.activeEntity++;
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
        this.lastSelectedEntityType = 'effect';
    }

    addModulator(modulator) {
        this.modulatorsInstances.push(modulator);
    }

    selectModulator(modulatorIndex) {
        this.activeModulator = modulatorIndex;
        this.lastSelectedEntityType = 'modulator';
    }

    selectParameter(parameter) {
        this.selectedParameter = parameter;
    }

    save() {
        let saveData = {};

        saveData.effectInstances     = this.effectInstances;
        saveData.modulatorsInstances = this.modulatorsInstances;

        let createLinks = (key, value) => {
            if (key == "pluggedIo" || key == "pluggedEntity") {
                if (value) {
                    return {
                        link: true,
                        uuid: value.uuid
                    }
                }
            }

            if (key == "inputList") {
                return [];
            }

            return value;
        };

        let saveDataJson = JSON.stringify(saveData, createLinks, 4);
        fs.writeFile("save.json", saveDataJson, (err) => console.log(err));

        console.log(saveDataJson);
    }

    load(EffectFactory) {
        let saveData  = JSON.parse(fs.readFileSync("save.json") );

        // Load instances
        let instances = saveData.effectInstances;
        this.effectInstances = [];

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

        // Load modulators
        let modulators = saveData.modulatorsInstances;
        this.modulatorsInstances = [];

        modulators.forEach((modulator) => {
            // Instantiate the modulator
            let component = EffectFactory.lookupComponentByName(modulator.name);
            let effect = new component();

            effect.loadParametersValues(modulator);

            this.modulatorsInstances.push(effect);
        });

        // Build the UUID to reference cache for resolving
        let uuidCache = {};
        let buildUUIDCacheRecursively = (element) => {
            if (element == null) {
                return;
            }

            if (typeof element == "object") {
                // Recursion on arrays
                if (Array.isArray(element)) {
                    element.forEach((child, index) => {
                        buildUUIDCacheRecursively(child);
                    });
                } else {
                    // Recursion on objects
                    Object.keys(element).forEach((key) => {
                        if (element.hasOwnProperty(key) ) {
                            buildUUIDCacheRecursively(element[key]);
                        }
                    });

                    if (element.uuid && !element.link) {
                        uuidCache[element.uuid] = element;
                    }
                }
            }
        }

        buildUUIDCacheRecursively(this.effectInstances);
        buildUUIDCacheRecursively(this.modulatorsInstances);

        // Resolve references
        let resolveRecursively = (element, parent, keyOrIndex) => {
            if (element == null) {
                return;
            }

            if (typeof element == "object") {
                // Recursion on arrays
                if (Array.isArray(element)) {
                    element.forEach((child, index) => {
                        resolveRecursively(child, element, index);
                    });
                } else {
                    // Detect the "link" keys we want to replace
                    if (element.link) {
                        parent[keyOrIndex] = uuidCache[element.uuid];
                    } else {
                        // Recursion on objects
                        Object.keys(element).forEach((key) => {
                            if (element.hasOwnProperty(key) ) {
                                resolveRecursively(element[key], element, key);
                            }
                        });
                    }
                }
            }
        };

        resolveRecursively(this.effectInstances,     null, null);
        resolveRecursively(this.modulatorsInstances, null, null);
    }
}

export default alt.createStore(Store, 'Store');
