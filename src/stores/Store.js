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

import RenderingEngine from '../popart/RenderingEngine';

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

class Store {
    constructor() {
        this.bindActions(Actions);
        this.reset();

        this.isWeb = process.env.web;
    }

    reset() {
        this.engines = [];
        this.engines[0] = new RenderingEngine();
        this.currentEngine = 0;

        this.engines.forEach((engine) => engine.reset() );

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
        this.engines[this.currentEngine].addEffect(effect);
    }

    moveEffect(parameters) {
        this.engines[this.currentEngine].moveEffect(parameters);
    }

    deleteEffect(effectIndex) {
        this.engines[this.currentEngine].deleteEffect(effectIndex);

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
        this.engines[this.currentEngine].addModulator(modulator);
    }

    selectModulator(modulatorIndex) {
        this.activeModulator = modulatorIndex;
        this.lastSelectedEntityType = 'modulator';
        this.selectedParameter = null;
    }

    deleteModulator(modulatorIndex) {
        this.engines[this.currentEngine].deleteModulator(modulatorIndex);

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
        let saveDataJson = this.engines[this.currentEngine].save();

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

        parameters.content = saveData;

        this.engines[this.currentEngine].load(parameters);

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
        this.engines.forEach((engine) => engine.sync() );
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
