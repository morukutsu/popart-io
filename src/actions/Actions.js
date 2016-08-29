import alt from '../alt';

let Actions = alt.generateActions(
    'addEffect',
    'deleteEffect',
    'selectEffect',
    'addModulator',
    'selectModulator',
    'selectParameter',
    'save',
    'load',
);

export default alt.createActions(Actions);
