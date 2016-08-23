import alt from '../alt';

let Actions = alt.generateActions(
    'addEffect',
    'deleteEffect',
    'selectEffect',
    'save',
    'load',
);

export default alt.createActions(Actions);
