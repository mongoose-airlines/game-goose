const Game = require('../models/game')
const axios = require('axios')

module.exports = {
  new: newGame
}

function newGame(req, res) {
  res.render("games/new", {
    title: "Game Search",
    user: req.user,
    results: null
  })
}