import EventEmitter from 'events';

class Events extends EventEmitter {}

const mainEventsEmitter = new Events();

export default mainEventsEmitter;
