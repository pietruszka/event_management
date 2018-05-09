//<<<<<<< post-put-delete-endpoints
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

module.exports.getEvents = function(req, res){
  var limit;
  var offset;

  if (req.query.limit) {
    limit = parseInt(req.query.limit, 10);
  }

  if (req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  Event
    .find(
      {
          dateStart : {$gte: new Date()}
      }
    )
    .skip(offset || 0)
    .limit(limit || 0)
    .sort({dateStart : 1})
    .exec((err, events) => {
      if(err){
        console.log(err);
      } else
      res
        .status(200)
        .json(events);
    });
  };

  module.exports.getEventById = function(req, res){

    var eventId = req.params.eventId;
    var today = new Date();

    Event
      .findById(eventId)
      .exec((err, thisEvent) => {

        if(err){
          console.log(err);
        } else
        res
          .status(200)
          .json(thisEvent);
      });
  };

  module.exports.getUserEvents = function(req, res){
    var userId = req.params.userId;

    User
      .findById(userId, {events : 1, isAdmin : 1}).exec((err, userEventList) => {
        if (userEventList.events.length > 0 && userEventList.isAdmin === true) {
          Event
            .find(
              {
                _id : {$in : userEventList.events}
              }
            )
            .exec((err, events) => {
              res
                .status(200)
                .json(events);
              });
        }
        else res.send('No events created by this user');
    });
};

