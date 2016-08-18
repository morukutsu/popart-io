import alt from '../alt';

let Actions = alt.generateActions(
    'addEffect',
    'deleteEffect',
    'save',
    'load',
);

export default alt.createActions(Actions);
