const router = require('express').Router()
const gamesCtrl = require('../controllers/games')

router.get('/new', isLoggedIn, gamesCtrl.new)
router.post('/search', isLoggedIn, gamesCtrl.search)
router.get('/:slug', isLoggedIn, gamesCtrl.show)
router.post('/:slug/watch', isLoggedIn, gamesCtrl.addToWatchList)
router.delete('/:slug/watch', isLoggedIn, gamesCtrl.removeFromWatchList)

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router