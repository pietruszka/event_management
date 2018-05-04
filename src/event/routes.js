const {Router} = require('express')
const eventsController = require('./controller.js')

class EventRouter {
    constructor() {
        this.router = Router();
        this.router.post('/api/event', eventsController.postEvents);
        this.router.put('/api/event/:eventID', eventsController.putEvents);
        this.router.delete('/api/event/:eventID', eventsController.deleteEvents);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new EventRouter();
