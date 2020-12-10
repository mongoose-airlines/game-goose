const Game = require('../models/game')

module.exports = {
  create
}

function create(req, res) {
  Game.findById(req.params.id)
  .then((game) => {
    game.reviews.push(req.body)
    game.save()
    .then(() => {
      res.redirect(`/games/${game.slug}`)
    })
  })
}