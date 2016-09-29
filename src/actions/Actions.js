import alt from '../alt';

let Actions = alt.generateActions(
    'addEffect',
    'deleteEffect',
    'selectEffect',
    'addModulator',
    'deleteModulator',
    'selectModulator',
    'selectParameter',
    'save',
    'load',
    'openFile',
    'saveFile',
    'quit',
    'new',
    'togglePlay',
    'stop',
);

export default alt.createActions(Actions);
