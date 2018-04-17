const {Router} = require('express')

class UserRouter {
    constructor() {
        this.router = Router();
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new UserRouter();