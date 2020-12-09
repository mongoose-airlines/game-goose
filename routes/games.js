const router = require('express').Router()
const gamesCtrl = require('../controllers/games')

router.get('/new', isLoggedIn, gamesCtrl.new)
router.post('/search', isLoggedIn, gamesCtrl.search)
router.get('/:slug', isLoggedIn, gamesCtrl.show)

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router