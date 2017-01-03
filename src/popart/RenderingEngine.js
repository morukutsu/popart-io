export default class RenderingEngine {
    constructor() {
        this.effectInstances = [];
        this.modulatorsInstances = [];
    }

    reset() {
        this.effectInstances = [];
        this.modulatorsInstances = [];
    }

    addEffect(effect) {
        this.effectInstances.push(effect);
    }

    moveEffect(parameters) {
        const src = parameters[0];
        const dst = parameters[1];

        const tmp = this.effectInstances[dst];
        this.effectInstances[dst] = this.effectInstances[src];
        this.effectInstances[src] = tmp;
    }

    deleteEffect(effectIndex) {
        let prevNumberOfInstances = this.effectInstances.length;
        this.effectInstances.splice(effectIndex, 1);
    }

    addModulator(modulator) {
        this.modulatorsInstances.push(modulator);
    }

    deleteModulator(modulatorIndex) {
        // Unplug any modulated parameter connected to this modulator
        let modulator = this.modulatorsInstances[modulatorIndex];
        if (modulator.outputList.length > 0) {
            modulator.outputList.forEach((outputIo) => {
                Object.keys(outputIo.pluggedToMe).forEach((uuid) => {
                    outputIo.pluggedToMe[uuid].unplug();
                });
            });
        }

        // Delete the modulator
        let prevNumberOfInstances = this.modulatorsInstances.length;

        this.modulatorsInstances.splice(modulatorIndex, 1);
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

        return JSON.stringify(saveData, createLinks, 4);
    }

    load(parameters) {
        this.reset();

        const EffectFactory = parameters.EffectFactory;
        const path          = parameters.path;

        let saveData = parameters.content;

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

    sync() {
        this.effectInstances.forEach((instance) => {
            instance.sync();
        });

        this.modulatorsInstances.forEach((instance) => {
            instance.sync();
        });
    }

}
