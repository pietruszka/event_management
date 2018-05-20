const User = require('../data/db').userModel;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../data/config.js');

function checkName(name){
  var regex = /\w+\s\w+/;
  if(regex.exec(name) == name){
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  } else {
    return 'wrong';
  }
}

function checkEmail(email){
  var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (regex.exec(email) == email) {
    return true;
  } else {
    return false;
  }
}

function checkPassword(pass){
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (regex.exec(pass) == pass) {
    return true;
  } else {
    return false;
  }
}

function checkPasswordRepeat(pass, passRpt){
  if (pass == passRpt) {
    return true;
  } else {
    return false;
  }
}

module.exports.registerUser = function(req, res){
  var name = req.body.name.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  var passwordRepeat = req.body.passwordRepeat.trim();

  User
    .findOne({'local.email' : email}).exec(function(err, user){
      if (err) {
        console.log(err);
      } else if(user){
        return res.status(400).json({'message' : 'email already used'});
      } else if(!user){
        var checkedName = checkName(name);
        var checkedEmail = checkEmail(email);
        var checkedPassword = checkPassword(password);
        var passwordRepeated = checkPasswordRepeat(password, passwordRepeat);

        if (checkedName == 'wrong') {
          res
            .status(400)
          .json({"message" : "Wrong name"});
        } else if (checkedEmail == false) {
          res
            .status(400)
          .json({"message" : "Wrong e-mail"});
        } else if (checkedPassword == false) {
          res
            .status(400)
          .json({"message" : "Wrong password. It should be at least 8 symbols, including at least one capital letter and one number"});
        } else if (passwordRepeated == false) {
          res
            .status(400)
          .json({"message" : "Repeat password correctly"});
        } else {
          bcrypt.hash(password, 10, function(err, result){
            if (err) {
              res
                .status(500)
                .json(err);
            } else {
              User
                .create(
                  {
                    local: {
                        name: name,
                        password: result,
                        email: email,
                    },
                    facebook: {
                        id: null,
                        fullname: null
                    },
                    events: [],
                    isAdmin: false
                  }, function(err, user){
                    if (err) {
                      res
                        .status(500)
                        .json(err);
                    } else {
                      var token = jwt.sign({
                        id : user._id
                      },
                      config.secret,
                      {
                        expiresIn : 3600
                      });
                      res
                        .status(201)
                        .json({'registered' : true, 'token' : token});
                    }
                  }
                );
            }
          });
        }
      }
    });
  };

    module.exports.authenticateUser = function(req, res){
      var email = req.body.email;
      var password = req.body.password;

      User
        .findOne({'local.email' : email}).exec(function(err, user){
          if (err) {
            res
              .status(500)
              .json(err);
          } else if (!user) {
            res
              .status(404)
              .json({'message' : 'User not found'});
          } else {
            bcrypt.compare(password, user.local.password, function(err, result){
              if (err) {
                res
                  .status(500)
                  .json(err);
              } else if (result == false) {
                res
                  .status(401)
                  .json({'message' : 'Invalid password'});
              } else {
                var token = jwt.sign(
                  {id : user._id},
                  config.secret,
                  {expiresIn : 3600}
                );
                res
                  .status(200)
                  .json({'message' : 'Signed In', 'name' : user.local.name, 'token' : token});
              }
            });
          }
        });
};
