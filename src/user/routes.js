const {Router} = require('express')
const usersController = require('./controller.js');

class UserRouter {
    constructor() {
        this.router = Router();

        this.router.post('/auth/local/register', usersController.registerUser);
        this.router.post('/auth/local/login', usersController.authenticateUser);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new UserRouter();
