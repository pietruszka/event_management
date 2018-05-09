const {Router} = require('express')
const eventsController = require('./controller.js')

class EventRouter {
    constructor() {
        this.router = Router();

        this.router.post('/api/event', eventsController.postEvents);
        this.router.put('/api/event/:eventID', eventsController.putEvents);
        this.router.delete('/api/event/:eventID', eventsController.deleteEvents);

        this.router.get('/api/event', eventsController.getEvents);
        this.router.get('/api/event/:eventId', eventsController.getEventById);
        this.router.get('/api/event/user/:userId', eventsController.getUserEvents);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new EventRouter();
