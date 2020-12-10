const router = require('express').Router()
const gamesCtrl = require('../controllers/games')

router.get('/new', isLoggedIn, gamesCtrl.new)
router.get('/', isLoggedIn, gamesCtrl.index)
router.post('/search', isLoggedIn, gamesCtrl.search)
router.get('/:slug', isLoggedIn, gamesCtrl.show)
router.post('/:slug/watch', isLoggedIn, gamesCtrl.addToWatchList)
router.delete('/:slug/watch', isLoggedIn, gamesCtrl.removeFromWatchList)
router.post('/:slug/collection', isLoggedIn, gamesCtrl.addToCollection)
router.delete('/:slug/collection', isLoggedIn, gamesCtrl.removeFromCollection)


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router