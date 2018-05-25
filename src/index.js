const express = require('express');

const config = require('./data/config');
const middleware = require('./middleware');
const userRouter = require('./user/routes');
const eventRouter = require('./event/routes');
const authRouter = require('./passport/auth-routes.js');
const passportSetup = require('./passport/passport-setup.js')
const passport = require('passport');
const cookieSession = require('cookie-session');


class Application {
    constructor() {

        this.app = express();
        this.init();
    }

    init() {
        this.app.listen(config.PORT, () => {
            console.log(`Server is running on port: ${config.PORT}`);
        });

        this.app.use(cookieSession({
          maxAge : 3600000,
          key : config.cookieKey
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.use('/auth', authRouter);

        this.app.use(middleware.getRouter());
        this.app.use(userRouter.getRouter());
        this.app.use(eventRouter.getRouter());
    }
}

module.exports = Application;
