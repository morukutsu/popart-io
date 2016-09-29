import alt           from '../alt';
import Actions       from '../actions/Actions';
import fs            from 'fs';
import electron      from 'electron';

class Store {
    constructor() {
        this.bindActions(Actions);

        this.effectList     = ["Synthesizer", "RuttEtra", "Mosaic", "LED"];
        this.modulatorsList = ["LFO", "Sequencer"];

        this.reset();
    }

    reset() {
        this.effectInstances = [];
        this.modulatorsInstances = [];

        // Focus
        this.lastSelectedEntityType = 'effect';
        this.activeEntity      = 0;
        this.activeModulator   = 0;
        this.selectedParameter = null;
    }

    new() {
        this.reset();
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

    deleteModulator(modulatorIndex) {
        // Unplug any modulated parameter connected to this modulator
        let modulator = this.modulatorsInstances[modulatorIndex];
        if (modulator.IO.output) {
            let outputIo = modulator.IO.output;

            Object.keys(outputIo.pluggedToMe).forEach((uuid) => {
                outputIo.pluggedToMe[uuid].unplug();
            });
        }

        // Delete the modulator
        let prevNumberOfInstances = this.modulatorsInstances.length;

        this.modulatorsInstances.splice(modulatorIndex, 1);

        // Reselect the current activeEntity after the effect instances list changed
        if (modulatorIndex <= this.activeModulator) {
            this.activeModulator--;
        }

        if (this.activeModulator < 0) {
            this.activeModulator = 0;
        }
    }

    selectParameter(parameter) {
        this.selectedParameter = parameter;
    }

    save(path) {
        let saveData = {};

        saveData.effectInstances     = this.effectInstances;
        saveData.modulatorsInstances = this.modulatorsInstances;

        let createLinks = (key, value) => {
            if (key == "pluggedIo" || key == "pluggedEntity") {
                if (value) {
                    return {
                        link: true,
                        uuid: value.uuid
                    };
                }
            }

            if (key == "pluggedToMe") {
                if (value) {
                    let newValue = {};
                    Object.keys(value).forEach((uuid) => {
                        newValue[uuid] = {
                            link: true,
                            uuid: uuid
                        };
                    });

                    return newValue;
                }
            }

            if (key == "inputList") {
                return [];
            }

            return value;
        };

        let saveDataJson = JSON.stringify(saveData, createLinks, 4);
        fs.writeFile(path, saveDataJson, (err) => console.log(err));
    }

    load(parameters) {
        const EffectFactory = parameters.EffectFactory;
        const path          = parameters.path;

        let saveData  = JSON.parse(fs.readFileSync(path) );

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
        let resolveRecursively = (element, parent, keyOrIndex, depth) => {
            if (element == null) {
                return;
            }

            if (typeof element == "object") {
                // Recursion on arrays
                if (Array.isArray(element)) {
                    element.forEach((child, index) => {
                        resolveRecursively(child, element, index, depth + 1);
                    });
                } else {
                    // Detect the "link" keys we want to replace
                    if (element.link) {
                        parent[keyOrIndex] = uuidCache[element.uuid];
                    } else {
                        // Recursion on objects
                        Object.keys(element).forEach((key) => {
                            if (element.hasOwnProperty(key) ) {
                                if (key == "pluggedToMe") {
                                    // TODO: find the right way to fix this
                                    // This key creates a loop in the data structure graph
                                    // We handle it by directly resolving if possible
                                    // FIX: Stop recursion if depth is too high
                                    if (depth <= 6) {
                                        resolveRecursively(element[key], element, key, depth + 1);
                                    }
                                } else {
                                    resolveRecursively(element[key], element, key, depth + 1);
                                }
                            }
                        });
                    }
                }
            }
        };

        resolveRecursively(this.effectInstances,     null, null, 0);
        resolveRecursively(this.modulatorsInstances, null, null, 0);
    }

    openFile(EffectFactory) {
        let dialog = electron.remote.dialog;
        let files = dialog.showOpenDialog({properties: ['openFile']});
        if (files && files.length > 0) {
            this.load({
                EffectFactory: EffectFactory,
                path:          files[0]
            });
        }
    }

    saveFile(EffectFactory) {
        let dialog = electron.remote.dialog;
        let file = dialog.showSaveDialog();
        if (file) {
            this.save(file);
        }
    }

    quit() {
        let app = electron.remote.app;
        app.quit();
    }
}

export default alt.createStore(Store, 'Store');
