const Game = require('../models/game')
const axios = require('axios')

module.exports = {
  new: newGame,
  search,
  show
}

function newGame(req, res) {
  res.render("games/new", {
    title: "Game Search",
    user: req.user,
    results: null
  })
}

function search(req, res) {
  axios
    .get(`https://api.rawg.io/api/games?page_size=5&search=${req.body.query}`)
    .then((response) => {
      console.log(response.data.results)
      res.render("games/new", {
        title: "Game Search",
        user: req.user,
        results: response.data.results
      })
    })
}

function show(req, res) {
  axios
    .get(`https://api.rawg.io/api/games/${req.params.slug}`)
    .then((response) => {
      res.render("games/show", {
        title: "Game Details",
        user: req.user,
        game: response.data
      }); 
    });
}