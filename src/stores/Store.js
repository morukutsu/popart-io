import alt           from '../alt';
import Actions       from '../actions/Actions';
import Recorder      from 'recorderjs';

import fs            from 'fs';
import electron      from 'electron';
import FileSaver     from 'file-saver';

//import detect        from 'bpm-detective';
//import detect from '../popart/AudioProcessing/BeatDetect';

import { SynthesizerCore } from '../popart/FX/Synthesizer/Synthesizer';

import bowlExample     from '../examples/bowl.json';
import bubblesExample  from '../examples/bubbles.json';
import joy2Example     from '../examples/joy2.json';
import purple_paperExample from '../examples/purple_paper.json';
import square_synthExample from '../examples/square_synth.json';
import stairwayExample from '../examples/stairway.json';
import tripExample from '../examples/trip.json';
import wavesExample from '../examples/waves.json';

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

class Store {
    constructor() {
        this.bindActions(Actions);
        this.reset();

        this.isWeb = process.env.web;
    }

    reset() {
        this.effectInstances = [];
        this.modulatorsInstances = [];

        // Focus
        this.lastSelectedEntityType = 'effect';
        this.activeEntity      = 0;
        this.activeModulator   = 0;
        this.selectedParameter = null;

        // Transport
        this.isPaused = false;
        this.bpm      = 120;

        // Add a simple synth
        this.addEffect(new SynthesizerCore() );
    }

    new() {
        this.reset();
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
        this.selectedParameter = null;
    }

    addModulator(modulator) {
        this.modulatorsInstances.push(modulator);
    }

    selectModulator(modulatorIndex) {
        this.activeModulator = modulatorIndex;
        this.lastSelectedEntityType = 'modulator';
        this.selectedParameter = null;
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

        if (this.isWeb) {
            var blob = new Blob([saveDataJson], { type: "text/plain;charset=utf-8" });
            FileSaver.saveAs(blob, "patch.json");
        } else {
            fs.writeFile(path, saveDataJson, (err) => console.log(err));
        }
    }

    load(parameters) {
        this.reset();

        const EffectFactory = parameters.EffectFactory;
        const path          = parameters.path;

        let saveData;
        if (path !== null) {
            saveData = JSON.parse(fs.readFileSync(path) );
        } else {
            saveData = JSON.parse(parameters.content);
        }

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

        this.setState({});
    }

    openFile(EffectFactory) {
        if (this.isWeb) {
            let fileUpload = document.getElementById('fileUpload');

            let onFileUpload = (e) => {
                fileUpload.removeEventListener('change', onFileUpload);

                if (e.target.files && e.target.files.length == 1) {
                    var reader = new FileReader();
                    reader.onloadend = () => {
                        this.load({
                            EffectFactory: EffectFactory,
                            path:          null,
                            content:       reader.result
                        });
                    }

                    reader.readAsText(e.target.files[0]);
                }
            };

            fileUpload.addEventListener('change', onFileUpload);

            fileUpload.click();
        } else {
            let dialog = electron.remote.dialog;
            let files = dialog.showOpenDialog({properties: ['openFile']});
            if (files && files.length > 0) {
                this.load({
                    EffectFactory: EffectFactory,
                    path:          files[0]
                });
            }
        }
    }

    saveFile(EffectFactory) {
        if (this.isWeb) {
            this.save("");
        } else {
            let dialog = electron.remote.dialog;
            let file = dialog.showSaveDialog();
            if (file) {
                this.save(file);
            }
        }
    }

    quit() {
        let app = electron.remote.app;
        app.quit();
    }

    togglePlay() {
        this.isPaused = !this.isPaused;
    }

    changeBpm(bpm) {
        this.bpm = bpm;
    }

    sync() {
        this.effectInstances.forEach((instance) => {
            instance.sync();
        });

        this.modulatorsInstances.forEach((instance) => {
            instance.sync();
        });
    }

    stop() {
        this.sync();
        this.isPaused = true;
    }

    autoBpm() {
        navigator.getUserMedia = navigator.webkitGetUserMedia;

        navigator.getUserMedia({ audio: true }, (stream) =>
            {
                var source = audioCtx.createMediaStreamSource(stream);

                var rec = new Recorder(source);

                rec.record();
                setTimeout(() => {
                    rec.stop();

                    rec.getBuffer((buffer) => {
                        let audioBuffer = audioCtx.createBuffer(2, buffer[0].length, 44100);

                        let channel0 = audioBuffer.getChannelData(0);
                        let channel1 = audioBuffer.getChannelData(1);
                        for (var i = 0; i < buffer[0].length; i++)
                        {
                            channel0[i] = buffer[0][i];
                            channel1[i] = buffer[1][i];
                        }

                        try {
                            let bpm = detect(audioBuffer, buffer[0].length);
                            this.changeBpm(bpm + 10);
                            this.emitChange();

                            // TODO: must schedule a sync on a the next music beat
                        } catch (err) {
                            console.log(err);
                        }
                    });

                    console.log("Recording ended");
                }, 5000);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    loadExample(parameters) {
        const EffectFactory = parameters.EffectFactory;
        const name          = parameters.name;

        let content = "";
        if (name === "bowl.json") {
            content = bowlExample;
        } else if (name === "bubbles.json") {
            content = bubblesExample;
        } else if (name === "joy2.json") {
            content = joy2Example;
        } else if (name === "purple_paper.json") {
            content = purple_paperExample;
        } else if (name === "square_synth.json") {
            content = square_synthExample;
        } else if (name === "stairway.json") {
            content = stairwayExample;
        } else if (name === "trip.json") {
            content = tripExample;
        } else if (name === "waves.json") {
            content = wavesExample;
        }

        this.load({
            EffectFactory: EffectFactory,
            path:          null,
            content:       JSON.stringify(content)
        });
    }
}

export default alt.createStore(Store, 'Store');
