import EventEmitter from 'events';

class Events extends EventEmitter {}

const mainEventsEmitter = new Events();
mainEventsEmitter.setMaxListeners(9999);

export default mainEventsEmitter;
