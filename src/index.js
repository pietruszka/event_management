const express = require('express');

const config = require('./data/config');
const middleware = require('./middleware');
const userRouter = require('./user/routes');
const eventRouter = require('./event/routes');

class Application {
    constructor() {
        this.app = express();
        this.init();
    }

    init() {
        this.app.listen(() => {
            console.log(`Server is running on port: ${config.PORT}`);
        })

        this.app.use(middleware.getRouter());
        this.app.use(userRouter.getRouter());
        this.app.use(eventRouter.getRouter());
    }
}

module.exports = Application;