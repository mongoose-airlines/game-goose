const router = require('express').Router()
const gamesCtrl = require('../controllers/games')


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router