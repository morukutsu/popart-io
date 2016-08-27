import alt from '../alt';

let Actions = alt.generateActions(
    'addEffect',
    'deleteEffect',
    'selectEffect',
    'addModulator',
    'selectParameter',
    'save',
    'load',
);

export default alt.createActions(Actions);
