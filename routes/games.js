const router = require('express').Router()
const gamesCtrl = require('../controllers/games')

router.get('/new', isLoggedIn, gamesCtrl.new)

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router