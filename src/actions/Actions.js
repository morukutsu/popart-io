import alt from '../alt';

let Actions = alt.generateActions(
    'addEffect',
    'moveEffect',
    'deleteEffect',
    'selectEffect',
    'addModulator',
    'moveModulator',
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
    'changeBpm',
    'sync',
    'autoBpm',
    'loadExample',
    'togglePatternMode',
    'activatePattern',
    'saveDeck',
    'loadDeck',
    'saveDeckFile',
    'openDeckFile',
);

export default alt.createActions(Actions);
