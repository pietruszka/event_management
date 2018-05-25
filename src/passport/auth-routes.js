const router = require('express').Router();
const passport = require('passport');


router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'photos']
}));

router.get('/facebook/callback', passport.authenticate('facebook'));

router.get('/facebook/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
