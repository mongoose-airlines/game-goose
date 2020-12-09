const Game = require('../models/game')
const axios = require('axios')

module.exports = {
  new: newGame,
  search,
  show,
  addToWatchList,
  removeFromWatchList,
  addToCollection,
  removeFromCollection
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
      Game.findOne({ slug: response.data.slug })
      .populate('favoritedBy')
      .then((game) => {
        if(game) {
          res.render("games/show", {
            title: "Game Details",
            user: req.user,
            game: response.data,
            favoritedBy: game.favoritedBy
          }); 
        } else {
          res.render("games/show", {
            title: "Game Details",
            user: req.user,
            game: response.data,
            favoritedBy: [""]
          }); 
        }
      })
    });
}

function addToWatchList(req, res) {
  req.user.watchList.push(req.body)
  req.user.save()
  .then(() => {
    res.redirect(`/games/${req.body.slug}`)
  })
}

function removeFromWatchList(req, res) {
  let idx = req.user.watchList.findIndex((g) => g.slug === req.params.slug)
  req.user.watchList.splice(idx, 1)
  req.user.save()
  .then(() => {
    res.redirect(`/games/${req.body.slug}`)
  })
}

function addToCollection(req, res) {
  Game.findOne({ slug: req.body.slug })
  .then((game) => {
    if (game) {
      game.favoritedBy.push(req.user._id)
      game.save()
      .then(() => {
        res.redirect(`/games/${req.body.slug}`)
      })
    } else {
      req.body.favoritedBy = req.user._id
      Game.create(req.body)
      .then(() => {
        res.redirect(`/games/${req.body.slug}`)
      })
    }
  })
}

function removeFromCollection(req, res) {
  Game.findOne({ slug: req.params.slug })
  .then((game) => {
    let idx = game.favoritedBy.indexOf(req.user._id)
    game.favoritedBy.splice(idx, 1)
    game.save()
    .then(() => {
      res.redirect(`/games/${req.body.slug}`)
    })
  })
}