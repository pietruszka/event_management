const Event = require('../data/db').eventModel;
const User = require('../data/db').userModel;

// DOROBIĆ AUTORYZACJĘ, TOKENY
// NAPRAWIĆ ID 

module.exports.postEvents = function(req, res, next) {
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    participants: mongoose.Types.ObjectId(),
    participantsMax: {
      type: req.body.type,
      min: 0,
      default: 10,
    },
    place: req.body.place
  });
  event
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created event successfully",
        createdEvent: {
          name: result.name,
          description: result.description,
          dateStart: result.dateStart,
          dateEnd: result.dateEnd,
          participants: result.participants,
          place: result.place,
        }
      });
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

};

module.exports.putEvents = function(req, res, next) {
   const id = req.params.eventId;
   const updateOps = {};
   for (const ops of req.body) {
     updateOps[ops.propName] = ops.value;
   }
   Event.update({ _id: id}, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Event updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

module.exports.deleteEvents = function(req, res, next) {
  const id = req.params.eventId;
  Event.remove({ _id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Event deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
