const {Router} = require('express')

class EventRouter {
    constructor() {
        this.router = Router();
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new EventRouter();