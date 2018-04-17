const mongoose = require('mongoose');

class EventModel {
    constructor(connection) {
        this.model = connection.model("Event", this._eventModel(), "Event");
    }
    getModel() {
        return this.model;
    }

    _eventModel() {
        return new mongoose.Schema(
            {
                name: String,
                description: String,
                dateStart: Date,
                dateEnd: Date,
                participants: [mongoose.Schema.Types.ObjectId],
                participantsMax: {
                    type: Number,
                    min: 0,
                    default: 10,
                },
                place: String
            });
    }
}

module.exports = EventModel;