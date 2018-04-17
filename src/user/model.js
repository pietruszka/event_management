const mongoose = require('mongoose');

class UserModel {
    constructor(connection) {
        this.model = connection.model("User", this._userModel(), "User");
    }
    getModel() {
        return this.model;
    }

    _userModel() {
        return new mongoose.Schema({
            local: {
                name: String,
                password: String,
                email: String,
            },
            facebook: {
                id: String,
                fullname: String
            },
            events: [mongoose.Schema.Types.ObjectId],
            isAdmin: {
                type: Boolean,
                default: false,
            },
        });
    }
}

module.exports = UserModel;