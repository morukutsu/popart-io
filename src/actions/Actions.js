import alt from '../alt';

let Actions = alt.generateActions(
    'addEffect',
    'save',
    'load',
);

export default alt.createActions(Actions);
