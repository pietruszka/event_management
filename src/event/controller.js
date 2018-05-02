const Event = require('../data/db').eventModel;
const User = require('../data/db').userModel;


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
