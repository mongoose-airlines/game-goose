# GameGoose Code-along

## Setup Instructions:
### Start by cloning the codealong repo to your machine, installing node modules, and opening the project in vs code:

```
git clone https://github.com/mongoose-airlines/game-goose.git
cd game-goose
npm i
code .
```

### As a reminder, the commands to pull the most recent version of the code from the repo, (and overwriting your current code) are:

```
git fetch --all
git reset --hard origin/main
```
___

## Starter code:

#### Items of note:
- Google OAuth is configured
- passport is configured
- database connection is configured
- partial views included
- the following packages have been added:
  - express-session
  - passport
  - mongoose
  - method-override
  - dotenv
  - passport-google-oauth

### Auth has been configured!  Let's take a look at our existing code and see what we're starting with.
#### (Your instructor will open the app and show each of the files, routes, and controller functions on the starter code.)

### The app won't work without a .env file, because it will contain the following items:

```
DATABASE_URL=XXXXXXXXXXXX
GOOGLE_CLIENT_ID=XXXXXXXXX
GOOGLE_SECRET=XXXXXXXXXXX
GOOGLE_CALLBACK=http://localhost:3000/auth/google/oauth2callback
SESSION_SECRET=XXXXXXXXXXX
```

- We'll use a single DATABASE_URL so that we can all add/remove data from the database as we move forward.
- The GOOGLE_CLIENT_ID and GOOGLE_SECRET values are already set up as well.  If you wanted to hook this application up to your own personal app, you can generate new values in your Google Developer Console.  (Make sure to add the callback URI as well!)
- The SESSION_SECRET can be set to anything you'd like.
- 
#### (Your instructor will share the contents of the .env with you in Slack right now.)


### Directories for partial views have been included.  The header contains a navbar, which we'll be adding to as we develop the application.  Check out the conditional rendering that's been set up to show different options based on whether there's a user logged in or not!  (Also, checkout the sweet goose noise when you click on the goose.)

___

# Plan of attack:

#### You can find a deployed version of the final version of the app we're building [here](https://gamegoose.herokuapp.com/).  Check it out if you're not already familiar with the functionality we'll need to code out.


#### Before we start building anything, we need to plan a few things out beforehand.  Just as you will in your projects, we're going to start by creating an ERD (Entity Relationship Diagram).  When you're building out an ERD, you'll occasionaly have fields that either don't end up in your final product, or get added along the way.  **Thinking about how your models are related to one another will significantly cut down on issues you'll run into when you start writing code.**


### Let's spend a few minutes discussing the following ERD:

![ERD](https://i.imgur.com/e18W2sB.png)

### Now that we have a good idea of what our models look like and what relationships they'll have with one another, we can plan out the steps we'll need to take to build everything out.

___
## Many Users >--< Many Stories!

- <s>AAU, I should be able to log in using Google Oauth</s>
- <s>AAU, I should be able to log in and out via the navbar</s>
- <s>AAU, I should only see links in the navbar if I’m logged in</s>
- AAU, I should be able to navigate between views using a navbar
- AAU, I should be able to search for a game using an API
- AAU, I should be able to view the details for the search results
- AAU, I should be able to view specific game information by selecting from the search results
- AAU, I should be able to add/remove a game to/from my collection
- AAU, I should be able to add/remove a game to/from my watch list
- AAU, I should be able to view my game collection
- AAU, I should be able to select a game from my collection and see its details
- AAU, I should be able to see a list of all users
- AAU, I should be able to select a user and see their profile / games / friends
- AAU, I should be able to ‘Friend/Un-Friend’ a user
- AAU, I should see a list of friends and the games I’m watching on my profile page
- AAU, I should be able to update certain information (my bio, avatar, and alias)
- AAU, I should be able to review a game if it is in my collection
- AAU, I should see a list of reviews for any game on it’s details page (with an average rating)
- AAU, I should be able to post a message on a ‘Message Board’
- AAU, I should be able to view the details of any ‘Message Board’ post
- AAU, I should see a list of replies on the ‘Message Details’ view, and be able to post a reply
- AAU, I should be able to join the ‘Chat Room’
- AAU, I should see all other current members in the ‘Chat Room’
- AAU, I should be able to post/view real-time messages to/from the chat screen

<br>

## Roadmap:
### 1. <s>Create the express app</s>
### 2. <s>Implement authentication</s>
### 3. <s>Implement authorization</s>
### 4. <s>Index view for users</s>
### 5. 'Profile' view for users
  - Determine the method verb & route
  - Write the UI
  - Write the route
  - Write the controller function
  - Write the view
### 6. Update functionality for Profile info
  - Determine the method verb & route
  - Write the UI
  - Write the route
  - Write the controller function
  - Write the view
### 7. 'User show' view
### 8. Add friend functionality
### 9. Add friend info to 'Profile' view
### 10. 'Add game' view
### 11. API call implementation
### 12. 'Game detail' view
### 13. 'Watchlist' functionality
### 14. 'Add to collection' functionality
### 15. 'Reviews' functionality
### 16. 'Game collection' view
### 17. 'Message Board' functionality
### 18. 'Reply' functionality
### 19. Implement real-time chat functionality

### Phew...  We've got a lot to get done!

___

## 'Profile' View:
### For the first few steps, I'll write out the steps for the 5-step cycle.  From there on, we'll be in a rhythm!!!

#### Step 1: Determine the method verb & route:

```
GET /users/profile
```
#
#### Step 2:  Write the UI.  Let's go write that route into our navbar in header.ejs:
```html
<li class="nav-item">
  <!-- Add the route to the href we have waiting to go! -->
  <a class="nav-link" href="/users/profile">My Profile</a>
</li>
```
# 
#### Step 3:  Write the route.  We already have a users router, so let's go add our new route:
```js
router.get('/profile', isLoggedIn, usersCtrl.showProfile);
```
#### Step 4:  Write the controller function:
```js
function showProfile(req, res) {
  // Let's talk about why we're using User.findById.
  // Ordinarily, you won't see this, as we have access
  // to the user via req.user.  Because we're going to 
  // use .populate later on to find "friends," we're 
  // going to stub it up like this in advance.
  User.findById(req.user._id)
    .then((user) => {
      res.render("users/profile", { title: "Profile Page", user });
    });
}
```
#### Step 5:  Write the view (There are several items we'll put in placeholders for now, then fill in functionality later.  In the course of normal app development, you'll be adding these things as you code them, but this will minimize our refactoring and bouncing all over the place later down the road.  You're welcome.):
```html
<%- include('../partials/header') %>

<h3><%= title %></h3>

<div class="card" style="width: 36rem;">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="profileinfo-tab" data-toggle="tab" href="#profileinfo" role="tab" aria-controls="profileinfo" aria-selected="true">My Info</a>
      </li>
      <!-- This is the info for the 'update' tab -->
      <li class="nav-item">
        <a class="nav-link" id="updateinfo-tab" data-toggle="tab" href="#updateinfo" role="tab" aria-controls="updateinfo" aria-selected="false">Update Info</a>
      </li>
      <!-- This is the info for the 'friends' tab -->
      <li class="nav-item">
        <a class="nav-link" id="friends-tab" data-toggle="tab" href="#friends" role="tab" aria-controls="friends" aria-selected="false">Friends</a>
      </li>
      <!-- This is the info for the 'watchlist' tab -->
      <li class="nav-item">
        <a class="nav-link" id="watchlist-tab" data-toggle="tab" href="#watchlist" role="tab" aria-controls="watchlist" aria-selected="false">Watch List</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="profileinfo" role="tabpanel" aria-labelledby="profileinfo-tab">
        <div class="card-body">
          <h5 class="card-title">Name: <%= user.name %></h5>
          <p class="card-text">Alias: <%= user.alias %></p>
          <p class="card-text">Email: <%= user.email %></p>
          <p class="card-text">Bio: <%= user.bio %></p>
        </div>
      </div>
      <!-- This is the card for the 'update' tab -->
      <div class="tab-pane fade" id="updateinfo" role="tabpanel" aria-labelledby="updateinfo-tab">
        <div class="card-body">
            <!-- This is where we'll put our 'update' route -->
            <form action="" method="POST">
                <div class="form-row">
                    <div class="col-md-4">
                        <label for="userAlias">Alias:</label>
                        <input type="text" id="userAlias" class="form-control" name="alias" value="<%= user.alias %>">
                    </div><br>
                </div>
                <div class="form-row">
                    <div class="col-md-12">
                        <label for="avatarUrl">Avatar Image URL:</label>
                    <input type="text" id="avatarUrl" class="form-control" name="avatar" value="<%= user.avatar %>">
                  </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12">
                        <label for="bio">Bio:</label>
                    <textarea rows="3" id="bio" class="form-control" name="bio"><%= user.bio %></textarea>
                  </div>
                </div>
                <button type="submit" class="btn btn-warning">Update</button>
              </form>
        </div>
      </div>
      <!-- This is the card for the 'friends' tab -->
      <div class="tab-pane fade" id="friends" role="tabpanel" aria-labelledby="friends-tab">
        <div class="card-body">
        <!-- This is where we'll use a forEach to display friends -->     
        </div>
      </div>
      <!-- This is the card for the 'watchlist' tab -->
      <div class="tab-pane fade show" id="watchlist" role="tabpanel" aria-labelledby="watchlist-tab">
        <div class="card-body">
        <!-- This is where we'll use a forEach to display watchlist items -->
        </div>
      </div>
    </div>
</div>

<%- include('../partials/footer') %>
```
# 
### Cross off an item on the list!  On to the next piece of functionality:
## 
### 'Update' functionality for Profile info:
#
#### Step 1:  Determine the method verb & route:
#### (Why don't we need the ._id of the user in our request?)
```
PUT /users/profile
```
#### Step 2:  Write the UI.  We already have everything stubbed up, we just need to pop a route into that href in the profile card!:
```html
<!-- This is where we'll put our 'update' route -->
<form action="/users/profile?_method=PUT" method="POST">
```
#### Step 3:  Write the route:
```js
router.put("/profile", isLoggedIn, usersCtrl.update);
```
#### Step 4:  Write the controller function:
```js
function update(req, res) {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true }).then(() => {
    res.redirect("/users/profile");
  });
}
```
####  Step 5:  We already handled the view.  This one's done already!!!
## 
### Now that we've been through the 5-step process a few times, these instructions aren't going to explicitly number them every time.  
##
### Let's code the user 'show' page next:
##
#### We already have a link using the user's ._id on our index page.  Let's go write the route!:
```js
router.get("/:id", isLoggedIn, usersCtrl.show);
```
#### Then on to the controller function:
```js
function show(req, res) {
  User.findById(req.params.id).then((userInfo) => {
    res.render('users/show', {
      title: 'User Details',
      userInfo,
      user: req.user
    })
  });
}
```
#### Next, we'll need to create /views/users/show.ejs:
```html
<%- include('../partials/header') %>

<h3><%= title %></h3>

<div class="card" style="width: 18rem;">
  <!-- If our user doesn't have an avatar image, let's use a silly cat picture! -->
  <img id="avatarPhoto" style="height: 18rem;" class="card-img-top" src="<%= userInfo.avatar ? userInfo.avatar : 'http://theoldreader.com/kittens/300/300/'  %>" alt="Card image cap">
  <div class="card-header">
  </div>
  <div class="card-body">
    <h5 class="card-title"><%= userInfo.name %></h5>
    <!-- Let's clean up the date data to show the day the user joined -->
    <p class="card-text">Joined: <%= userInfo.createdAt.toLocaleString().split(',')[0] %></p>
    <p class="card-text">Email: <a href="mailto:<%= userInfo.email %>"><%= userInfo.email %></a></p>
    <p class="card-text">Favorite Games:</p>
    <!-- This is where we'll iterate over the games with a forEach -->
    <!-- This is where we'll render buttons to add/remove a user as a friend -->
  </div>
</div>

<%- include('../partials/footer') %>
```
#### That's a pretty sweet looking user profile.  (Not really, the styling is up to y'all on your own time...)
##
### Now that we can see each user's details, let's go all Facebook and implement a simple 'friend' feature.
##
#### Start by adding a 'friends' field to the user model.  We're going to use referencing.  Many users will have many friends, so we're going to store each user's 'friends' as ObjectId values in an array:
```js
const userSchema = new Schema(
  {
    name: String,
    alias: String,
    email: String,
    avatar: String,
    googleId: String,
    bio: String,
    // Add this to the model:
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
```
#### Now we'll need a button on the user 'show' page to handle a request for 'adding' a friend.  We don't need to send a data payload, as we have access to the ._id for the user we're 'friend'ing, and we always have access to the ._id for the user that's logged in!:
```html
<!-- This is where we'll render buttons to add/remove a user as a friend -->
<% if (!userInfo._id.equals(user._id) && !user.friends.includes(userInfo._id)) { %>
  <a href="/users/<%= userInfo._id %>/friend" class="btn btn-primary">Add Friend</a>
<% } %>
<% if (!userInfo._id.equals(user._id) && user.friends.includes(userInfo._id)) { %>
  <a href="/users/<%= userInfo._id %>/unfriend" class="btn btn-primary">Remove Friend</a>
<% } %>
```
#### We're adding routes for both adding AND removing friends.  Two geese with one stone!  Let's use route/controller names that indicate what we're trying to accomplish, as it's not in the normal scope of our chart:
```js
router.get("/:id/friend", isLoggedIn, usersCtrl.addFriend);
router.get("/:id/unfriend", isLoggedIn, usersCtrl.removeFriend);
```
#### And now for the controller functions:
```js
function addFriend(req, res) {
  req.user.friends.push(req.params.id);
  req.user.save().then(() => {
    res.redirect(`/users/${req.params.id}`);
  });
}

function removeFriend(req, res) {
  let idx = req.user.friends.indexOf(req.params.id);
  req.user.friends.splice(idx, 1);
  req.user.save().then(() => {
    res.redirect(`/users/${req.params.id}`);
  });
}
```
#### Navigate to someone special in the user list and add them to your friend list!  Notice how the button changes based on whether the ._id of the user who you're viewing is in the logged in user's referenced friends array!
## 
#### We're adding friends, but for them to show up on our user profile view, we'll need to go update our controller function for 'showProfile' as we're now requiring the 'friends' field to be passed to the view.  It's time to use .populate()!!!!
```js
function showProfile(req, res) {
User.findById(req.user._id)
  // Populate is SO HOT right now...
  .populate("friends")
  .then((user) => {
    res.render("users/profile", { title: "Profile Page", user });
  });
}
```
#### Now that we have our friends, let's go adjust the user profile view:
```html
<!-- This is where we'll use a forEach to display friends --> 
<% user.friends.forEach(f => { %>
  <a href="/users/<%= f._id %>"><img width="30" id="avatarPhoto" src="<%= f.avatar %>" alt=""><%= f.name %> <%= f.alias ? `(${f.alias})` : '' %></a><br><br>
<% }) %>
```
#### (Notice that we're displaying the alias of the friend if they have one saved!)
##
### Our user feature-set is looking pretty solid, so let's start working on the game features!
___
### Adding games:
##
#### In order for the user to add a game, they'll need to first search for it using an API.  Let's take a detour and go check out [the API](https://medium.com/rawg/launching-public-api-for-the-largest-video-game-database-in-the-world-fa260a336079) that we'll be using for this app.  Let's try out some of the endpoints using Postman and see what the data looks like when it is returned.
##
#### Now that we've got a picture of our data, we can write our model.  While we're at it, let's add the router, routes, and controller for the games resource:
```js
// /models/game.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    reviewer: String,
    reviewerPhoto: String,
    rating: { type: Number, min: 1, max: 10 },
    content: String,
  },
  {
    timestamps: true,
  }
);

const gameSchema = new Schema(
  {
    title: String,
    slug: String,
    rawgId: Number,
    released: Date,
    imageUrl: String,
    videoUrl: String,
    metacriticScore: Number,
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);
```
```js
// server.js
const gamesRouter = require("./routes/games");
.
. // middleware is all here
.
app.use("/games", gamesRouter);
```
```js
// /routes/games.js
const router = require("express").Router();
const gamesCtrl = require("../controllers/games");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;
```
```js
// /controllers/games.js
const Game = require('../models/game.js');

module.exports = {

}
```
#### Let's start with a view containing a form for the user to submit a search to the API.  We have a placeholder set up in the navbar, so let's go fill in a route:
```html
<li class="nav-item">
  <!-- Add the route here -->
  <a class="nav-link" href="/games/new">Add Game</a>
</li>
```
#### Then on to the route:
```js
router.get("/new", isLoggedIn, gamesCtrl.new);
```
#### Then the controller function:
```js
// Start by requiring axios at the top of the file. 
// We'll be using axios to send calls to the API.
const axios = require("axios");

module.exports = {
  new: newGame
}

function newGame(req, res) {
  res.render("games/new", {
    title: "Game Search",
    user: req.user,
    // Why are we passing this?  Take a look at the view we're about to write!
    results: null,
  });
}
```
#### Let's create /games/new.ejs:
```html
<%- include('../partials/header') %>

<h3><%= title %></h3>
<!-- We'll need to fill in the route for this search form -->
<form action="" method="POST">
  <div class="form-row">
    <div class="col-md-4">
      <input type="text" class="form-control" name="query" placeholder="Search for game...">
    </div>
  </div>
  <button type="submit" class="btn btn-success">Search</button>
</form>
<!-- This is where we'll output the results to the page -->
<!-- after they are returned from the API call! -->
<% if (results) { %>
  <% results.forEach(game => { %>
    <div class="card" style="width: 18rem;">
      <img src="<%= game.background_image %>" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title"><%= game.name %> </h5>
        <p class="card-text">Released: <%= game.released %></p>
        <p>Platforms:</p>
        <% game.platforms.forEach(p => { %>
          <p class="card-text"><%= p.platform.name %></p>
        <% }) %>
        <p class="card-text">Metacritic Score: <%= game.metacritic ? game.metacritic : 'N/A' %></p>
        <!-- This is a button that we'll use to navigate to the game's 'show' page.  We still need to fill in the route -->
        <a href="" class="btn btn-primary">Details</a>
      </div>
    </div>
  <% }) %>
<% } %> 

<%- include('../partials/footer') %>
```
#### We've got our form, let's make it do something!  Add a route to the form so that we're submitting a post request with the search info:
```html
<!-- This is the route we're filling in -->
<form action="/games/search" method="POST">
```
#### Then we write the route:
```js
router.post("/search", isLoggedIn, gamesCtrl.search);
```
#### Then the controller function:
```js
function search(req, res) {
  axios
    .get(`https://api.rawg.io/api/games?page_size=5&search=${req.body.query}`)
    .then((response) => {
      console.log(response.data.results);
      res.render("games/new", {
        title: "Game Search",
        user: req.user,
        results: response.data.results,
      });
    });
}
```
#### Let's play around with this function using some console.logs before proceeding to make sure we're getting our data back!
#### Notice how we're rendering the same 'new' search page, but this time we're passing our bountiful data to be displayed all pretty-like for all to see!
## 
### Let's add a route to the "details" button so we can navigate to a 'show' page for the game.  Here, we'll have access to more information about the game, potentially a video, and can show who has it in their collection, along with any reviews it has been given.
```html
<!-- This is a button that we'll use to navigate to the game's 'show' page.  We still need to fill in the route -->
<a href="/games/<%= game.slug %>" class="btn btn-primary">Details</a>
```
#### Then we write the route:
```js
router.get("/:slug", isLoggedIn, gamesCtrl.show);
```
#### Then the controller function:
```js
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
};
```
#### Now, for the games/show.ejs!  There's a lot of space here for future additions, so be sure to check out all the comments:
```html
<%- include('../partials/header') %>
<h3>Game Details Page</h3>
<% if (game.clip != null) { %>
  <video width="480" height="320" controls="controls">
    <source src="<%= game.clip.clips.full %>" type="video/mp4">
  </video>
    <% } %>
    <div class="card" style="width: 36rem;">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="gameinfo-tab" data-toggle="tab" href="#gameinfo" role="tab" aria-controls="gameinfo" aria-selected="true">Game Info</a>
        </li>
        <!-- This is the tab header for the list of who has the game in their collection -->
        <li class="nav-item">
          <a class="nav-link" id="favorited-tab" data-toggle="tab" href="#favorited" role="tab" aria-controls="favorited" aria-selected="false">Owned By</a>
        </li>
        <!-- This is the tab header for reviews -->
        <li class="nav-item">
          <a class="nav-link" id="reviews-tab" data-toggle="tab" href="#reviews" role="tab" aria-controls="reviews" aria-selected="false">Reviews</a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="gameinfo" role="tabpanel" aria-labelledby="gameinfo-tab">
          <div class="card-body">
            <h5 class="card-title"><%= game.name %> </h5>
            <p class="card-text">Released: <%= game.released %></p>
            <p class="card-text"><%= game.description_raw %></p>
            <p>Platforms:</p>
            <% game.platforms.forEach(p => { %>
              <p class="card-text"><%= p.platform.name %></p>
            <% }) %>
            <p class="card-text">Metacritic Score: <%= game.metacritic ? game.metacritic : 'N/A' %></p>
          </div>
        </div>
        <!-- This is the tab that will contain our forEach loop indicating who has the game in their collection -->
        <div class="tab-pane fade" id="favorited" role="tabpanel" aria-labelledby="favorited-tab">
          <div class="card-body">
            <p>Owned By:</p>
            <!-- This is where we'll put our favoritedBy.forEach loop -->
          </div>
        </div>
        <!-- This is the tab that holds the review info for a game -->
        <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
           <!--This is where we'll put all the info for reviews  -->
        </div>
      </div>
      
    <!-- This is where we'll put a button to add/remove a game to/from our collection -->
    <!-- This is where we'll put a button to add/remove a game to/from our watchlist -->
 
<%- include('../partials/footer') %>
```
#### Now we're checking out games!
##
### Next, let's add the ability for a user to add a game to their watchlist.  Let's start by adding to our model.  We'll need to embed the watchList within the user model:
```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchListSchema = new Schema(
  {
    title: String,
    slug: String,
    released: Date,
  },
  {
    timestamps: true,
  }
);

const userSchema = new Schema(
  {
    name: String,
    alias: String,
    email: String,
    avatar: String,
    googleId: String,
    bio: String,
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    watchList: [watchListSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
```
#### Next, let's add those buttons we left space for on our games/show.ejs:
```html
<% if (user.watchList.some(g => {return g.slug === game.slug})) { %>
  <form action="/games/<%= game.slug %>/watch?_method=DELETE" method="POST">
<% } else { %>
  <form action="/games/<%= game.slug %>/watch" method="POST">
<% } %>
  <input type="text" hidden name="title" value="<%= game.name %>">
  <input type="text" hidden name="slug" value="<%= game.slug %>">
  <input type="date" hidden name="released" value="<%= game.released %>">
  <button class="btn btn-success"><%= user.watchList.some(g => {return g.slug === game.slug}) ? "Unwatch" : "Watch" %></button>
</form>
```
#### Notice the way we're using conditional rendering for both the opening <form> tag AND the button!  Ternary statements are great!!!
#### We just wrote two routes for watching/unwatching games.  Let's go add em to the router:
```js
router.post("/:slug/watch", isLoggedIn, gamesCtrl.addToWatchList);
router.delete("/:slug/watch", isLoggedIn, gamesCtrl.removeFromWatchList);
```
#### Now the controller functions:
```js
function addToWatchList(req, res) {
  req.user.watchList.push(req.body);
  req.user.save().then(() => {
    res.redirect(`/games/${req.body.slug}`);
  });
}

function removeFromWatchList(req, res) {
  let idx = req.user.watchList.findIndex((g) => g.slug === req.params.slug);
  req.user.watchList.splice(idx, 1);
  req.user.save().then(() => {
    res.redirect(`/games/${req.body.slug}`);
  });
}
```
#### No need to render a view, as we're just redirecting to our current page.  Now we're watching games!  Let's go update our user profile tab to reflect the changes!
```html
<div class="tab-pane fade show" id="watchlist" role="tabpanel" aria-labelledby="watchlist-tab">
        <div class="card-body">
        <!-- This is where we'll use a forEach to display watchlist items -->
        <!-- New code below: -->
        <% user.watchList.forEach(g => { %>
          <a href="/games/<%= g.slug %>"><p><%= g.title %></p></a>
        <% }) %>
        </div>
      </div>
```
#### Another piece of functionality!  Huzzah!
##
### Adding a game to a user's collection:
##
#### Let's start by creating a button on our games/show.ejs view for a route to add/remove a game from the user's collection:
```html
<% if (favoritedBy.some(u => {return u.email === user.email})) { %>
  <form action="/games/<%= game.slug %>/collection?_method=DELETE" method="POST">
    <% } else { %>
  <form action="/games/<%= game.slug %>/collection" method="POST">
<% } %>
  <input type="text" hidden name="title" value="<%= game.name %>">
  <input type="date" hidden name="released" value="<%= game.released %>">
  <input type="number" hidden name="metacriticScore" value="<%= game.metacritic %>">
  <input type="text" hidden name="videoUrl" value="<%= game.clip ? game.clip.clips.full : "" %>">
  <input type="text" hidden name="imageUrl" value="<%= game.background_image %>">
  <input type="number" hidden name="rawgId" value="<%= game.id %>">
  <input type="text" hidden name="slug" value="<%= game.slug %>">
  <button class="btn btn-warning"><%= favoritedBy.some(u => {return u.email === user.email}) ? "Remove from Collection" : "Add to Collection" %></button>
  </form>
```
#### Notice that we're using the same type of conditional rendering for the form type and ternary magic for the button text that we did for the watchlist!  
#### Next, the two routes:
```js
router.post("/:slug/collection", isLoggedIn, gamesCtrl.addToCollection);
router.delete("/:slug/collection", isLoggedIn, gamesCtrl.removeFromCollection);
```
#### And then the controller functions:
```js
function addToCollection(req, res) {
  req.body.favoritedBy = req.user._id;
  Game.findOne({ slug: req.body.slug }).then((game) => {
    // Notice that we have to check to see whether the game is already in the database.  
    // This is done to prevent duplicate game entries, which would cause headaches for handling reviews!
      // If the query returns a game, push the user's id to the favorite field.
    if (game) {
      game.favoritedBy.push(req.user._id);
      game.save().then(() => {
        res.redirect(`/games/${req.body.slug}`);
      });
    } else {
        // If not, create a new game in the database (with the user's id attached in req.body)
      Game.create(req.body).then(res.redirect(`/games/${req.body.slug}`));
    }
  });
}

function removeFromCollection(req, res) {
  Game.findOne({ slug: req.params.slug }).then((game) => {
    let idx = game.favoritedBy.indexOf(req.user._id);
    game.favoritedBy.splice(idx, 1);
    game.save().then(() => {
      res.redirect(`/games/${req.params.slug}`);
    });
  });
}
```
#### We're adding and removing to the collection, so let's go add this to our user show view so we can see our friends' games.  Start by updating the users show controller function (we need to query for games after getting the user by id)
```js
function show(req, res) {
  User.findById(req.params.id).then((userInfo) => {
    Game.find({ favoritedBy: userInfo._id }).then((games) => {
      res.render("users/show", {
        title: "User Details",
        userInfo,
        user: req.user,
        games,
      });
    });
  });
}
```
#### Now let's adjust the users/show.ejs to reflect having access to the games:
```html
<%- include('../partials/header') %>

<h3>User Detail Page</h3>

<div class="card" style="width: 18rem;">
  <img id="avatarPhoto" style="height: 18rem;" class="card-img-top" src="<%= userInfo.avatar ? userInfo.avatar : 'http://theoldreader.com/kittens/300/300/'  %>" alt="Card image cap">
  <div class="card-header">
  </div>
  <div class="card-body">
    <h5 class="card-title"><%= userInfo.name %></h5>
    <p class="card-text">Joined: <%= userInfo.createdAt.toLocaleString().split(',')[0] %></p>
    <p class="card-text">Email: <a href="mailto:<%= userInfo.email %>"><%= userInfo.email %></a></p>
    <p class="card-text">Favorite Games:</p>
    <% games.forEach(game => { %>
      <a href="/games/<%= game.slug %>"><%= game.title %></a><br>
    <% }) %><br>
    <% if (!userInfo._id.equals(user._id) && !user.friends.includes(userInfo._id)) { %>
      <a href="/users/<%= userInfo._id %>/friend" class="btn btn-primary">Add Friend</a>
    <% } %>
    <% if (!userInfo._id.equals(user._id) && user.friends.includes(userInfo._id)) { %>
      <a href="/users/<%= userInfo._id %>/unfriend" class="btn btn-primary">Remove Friend</a>
    <% } %>
  </div>
</div>

<%- include('../partials/footer') %>
```
#### Cross another item off the list!  Now all we've got left is showing our personal game collection and adding reviews.  Let's tackle the game collection first.
##
### Adding a view for 'Game Collection'  
##
#### Start with the UI.  We have an empty link in the navbar.  Let's give it a route and give it a purpose in life.
```html
<li class="nav-item">
  <a class="nav-link" href="/games">Game Collection</a>
</li>
```
#### Next, the route:
```js
router.get("/", isLoggedIn, gamesCtrl.index);
```
#### And the controller function:
```js
function index(req, res) {
  Game.find({ favoritedBy: req.user._id }).then((games) => {
    res.render("games/index", {
      title: "Game Collection",
      user: req.user,
      games,
    });
  });
}
```
#### Next, we'll need to create and code out our games/index.ejs:
```html
<%- include('../partials/header') %>

<h3>Game Collection</h3>

<% games.forEach(game=> { %>
  <div class="card" style="width: 18rem;">
    <img src="<%= game.imageUrl %>" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title"><%= game.title %> </h5>
      <p class="card-text">Released: <%= game.released.toLocaleString().split(',')[0] %></p>
      <p class="card-text">Metacritic Score: <%= game.metacriticScore ? game.metacriticScore : 'N/A' %></p>
      <a href="/games/<%= game.slug %>" class="btn btn-primary">Details</a>
    </div>
  </div>
<% }) %>

<%- include('../partials/footer') %>
```
#### Let's add the last piece of the game-puzzle:  Reviews.  This is going to take a little refactoring in a few places, but after all the work we've done, it shouldn't be too hard!  Let's adjust the controller function for our games/show page first to handle passing a little more information.  We need to know IF the game is in the database, so our function becomes a little more complicated:
```js
function show(req, res) {
  axios
    .get(`https://api.rawg.io/api/games/${req.params.slug}`)
    .then((response) => {
      Game.findOne({ slug: response.data.slug })
        .populate("favoritedBy")
        .then((game) => {
          if (game) {
            res.render("games/show", {
              title: "Game Details",
              user: req.user,
              game: response.data,
              favoritedBy: game.favoritedBy,
              gameId: game._id,
              reviews: game.reviews,
            });
          } else {
            res.render("games/show", {
              title: "Game Details",
              user: req.user,
              game: response.data,
              favoritedBy: [""],
              reviews: [""],
            });
          }
        });
    });
}
```
#### Next, the UI:  Let's add it to the games/show page.  Let's also make it so that a user can't review a game unless they've added it to their favorites AND can only add a single review:
```html
<!--This is where we'll put all the info for reviews  -->
<% let total = 0 %>
<% reviews.forEach(r => { %>
  <% total+= r.rating %>
  <p><%= r.rating %> - <img width="20" id="avatarPhoto" src="<%= r.reviewerPhoto %>" alt=""> <%= r.reviewer %></p>
  <p><%= r.content %></p>
<% }) %>
<p>GameGoose Score: <%= (total / reviews.length).toFixed(2) %></p>
<% if (!reviews.some(u => {return u.reviewer === user.name}) && favoritedBy.some(u => {return u.email === user.email})) { %>
  <form action="/games/<%= gameId %>/reviews" method="POST">
    <div class="form-group">
      <textarea class="form-control" name="content" style="width: 18rem;" id="exampleFormControlTextarea1" placeholder="Leave a Review" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label for="exampleFormControlSelect1">Rating</label>
      <select style="width: 18rem;" class="form-control" name="rating" id="exampleFormControlSelect1">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
      </select>
    </div>
    <input type="text" hidden name="reviewer" value="<%= user.name %>">
    <input type="text" hidden name="reviewerPhoto" value="<%= user.avatar %>"> 
    <button class="btn btn-info">Submit</button>
  </form>
<% } %>
```
#### Notice how we're adding the user's avatar and name to the review in HIDDEN fields before sending it in the form?  Tricky!!!
#### We're gonna need a new router/controller to handle reviews, as they're an embedded resource.  We can do it while we write the route!
```js
// additions to server.js:
const reviewsRouter = require("./routes/reviews");
.
. // middleware lives here...
.
app.use("/", reviewsRouter);

```
```js
// routes/reviews.js:
const router = require("express").Router();
const reviewsCtrl = require("../controllers/reviews");

router.post("/games/:id/reviews", isLoggedIn, reviewsCtrl.create);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;
```
```js
// controllers/reviews.js:
const Game = require("../models/game");

module.exports = {
  create,
};

function create(req, res) {
  Game.findById(req.params.id).then((game) => {
    game.reviews.push(req.body);
    game.save().then(() => {
      res.redirect(`/games/${game.slug}`);
    });
  });
}
```
#### Now that we're posting reviews, we should see them showing up on the games/show page!
##
### We've got all the 'game' and 'user' funcitonality of our app built out.  Now, we're going to focus on messaging utility.  We'll start by adding a 'Message Board' where users will be able to make posts, then we'll add a 'reply' ability so that users can post replies.
#
#### Let's start by adding some models.  We'll need a model for 'messages' first.  We'll embed a reply schmema inside of it:
```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema({
  postedBy: String,
  avatar: String,
  message: String,
});

const messageSchema = new Schema(
  {
    postedBy: String,
    avatar: String,
    title: String,
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
```
#### Nothing we haven't seen before!  Let's go add a router and a controller as well:
```js
// server.js
const messagesRouter = require("./routes/messages");
.
. // middleware lives here
.
app.use("/messages", messagesRouter);
```
#### Let's create our 'Message Board' page next.  That'll require adding a UI to our nav bar in the location we've earmarked for it:
```html
<li class="nav-item">
  <a class="nav-link" href="/messages">Message Board</a>
</li>
```
#### Next, the route:
```js
router.get("/", isLoggedIn, messagesCtrl.index);
```
#### Then the controller function:
```js
function index(req, res) {
  Message.find({}).then((messages) => {
    res.render("messages/index", {
      title: "Message Board",
      user: req.user,
      messages: messages.reverse(),
    });
  });
}
```
#### Let's go create the view next:
```html
<%- include('../partials/header') %>

<h3>Message Board</h3>
<form action="/messages" method="POST">
  <div class="form-group">
    <input type="text" class="form-control" aria-describedby="message" name="title" placeholder="Enter message...">
  </div>
  <button type="submit" class="btn btn-success">Create Post</button>
</form>

<% messages.forEach(message => { %>
  <div class="card">
    <div class="card-header">
      <%= message.postedBy %> <img id="avatarPhoto" width="30" src="<%= message.avatar %>" alt="">
    </div>
    <div class="card-body">
      <h5 class="card-title"><%= message.title %></h5>
      <h6><%= message.createdAt.toLocaleString()%></h6>
      <a href="/messages/<%= message._id %>" class="btn btn-primary">See Post</a>
    </div>
  </div>
<% }) %>

<%- include('../partials/footer') %>
```
##
#### We've got another route now, back to the router!
```js
router.post("/", isLoggedIn, messagesCtrl.create);
```
#### Then on to the controller:
```js
function create(req, res) {
  req.body.postedBy = req.user.name;
  req.body.avatar = req.user.avatar;
  Message.create(req.body).then(() => {
    res.redirect("/messages");
  });
}
```
#### Now that we've got the posts down, we'll need a show page to view a post so that we're able to add replies.  Start with the route we set up in the messages.forEach loop on our index page:
```js
router.get("/:id", isLoggedIn, messagesCtrl.show);
```
#### Then the controller:
```js
function show(req, res) {
  Message.findById(req.params.id).then((message) => {
    res.render("messages/show", {
      title: "Message Details",
      user: req.user,
      message,
    });
  });
}
```
#### We'll need to create a show page for the messages next:
```html
<%- include('../partials/header') %>

<h3>Message Details</h3>
<h4><%= message.title %></h4>
<h5>Posted on <%= message.createdAt.toLocaleString() %> - <%= message.postedBy %> <img id="avatarPhoto" width="30" src="<%= message.avatar %>" alt=""></h5>

<% message.replies.forEach(reply => { %>
    <h6><%= reply.message %> - <%= reply.postedBy %> <img id="avatarPhoto" width="25" src="<%= reply.avatar %>" alt=""></h6>
<% }) %>

<form action="/messages/<%= message._id %>" method="POST">
  <div class="form-group">
    <input type="text" class="form-control" aria-describedby="message" name="message" placeholder="Enter reply...">
  </div>
  <button type="submit" class="btn btn-primary">Reply</button>
</form>

<%- include('../partials/footer') %>
```
#### We just set ourselves up with the last route we'll need to add replies.  Let's go write it in our router:
```js
router.post("/:id", isLoggedIn, messagesCtrl.reply);
```
#### Our last controller function!  Is it really almost all over?!?!?! (Of course not, we still have a CHAT ROOM to build!!!)
```js
function reply(req, res) {
  Message.findById(req.params.id).then((message) => {
    req.body.postedBy = req.user.name;
    req.body.avatar = req.user.avatar;
    message.replies.push(req.body);
    message.save().then(() => {
      res.redirect(`/messages/${req.params.id}`);
    });
  });
}
```
#### Now we're replying to posts!
##
### The last piece of functionality we'll be adding to our application will utilize socket.io to implement a live-chat 'room' where users will be able to message one another, see if someone is typing, and hear some fun sounds on certain events (people entering/leaving the 'room').
#### Let's talk a little bit about how socket.io works before we start writing code.

#### Detour:[Socket.io](https://socket.io/docs/)

####  Now that you've gotten an idea of what we'll be implementing, let's go write a route/controller/view to handle navigating to the 'chat room.'
#### Let's start by creating a module to handle all of our server-side socket.io stuff.  We also need to install the socket.io npm package:
```
touch io.js
npm i socket.io
```
#### Head back into the bin/www file and make sure we're loading socket.io when we start the server:
```js
const server = http.createServer(app);
// Existing code above
/**
 * Listen on provided port, on all network interfaces.
 */
const io = require('../io')
io.attach(server)


```
#### Inside of the io.js, we'll need to require the module, then we'll export the contents as io:
```js
const io = require('socket.io')()

// defining an empty object to hold a list of 'chatters'
let chatters = {}


io.on('connection', (socket) => {
  // This is where all of our server-side socket.io functionality will exist.  

    // When anyone 'enters the room (loads the page)', add them to the list and play a sound

    // When anyone 'leaves the room (navigates away from the page)', remove them from the list and play a sound

    // When anyone sends a message, send the message to all of the connected clients and play a sound

    // When anyone presses a key while typing a message, display a '(user) is typing...' message to all clients
})

module.exports = io
```
#### First, the model.  It's exceptionally simple:
```js
// models/chat.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    username: String,
    avatar: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
```
#### Next, let's add a UI to our navbar:
```html
<li class="nav-item">
  <a class="nav-link" href="/chatroom">Chat Room</a>
</li>
```
#### Let's add our router/controller next:
```js
// server.js
const chatRouter = require('./routes/chat');
.
. // middleware, HOOOOOOO!!!!!
.
app.use('/chatroom', chatRouter);
```
```js
// routes/chat.js
const router = require('express').Router();
const chatCtrl = require('../controllers/chat');

router.get("/", isLoggedIn, chatCtrl.chatRoom);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;
```
```js
// controllers/chat.js
function chatRoom(req, res) {
  res.render("chatroom", {
    title: "Chat Room",
    user: req.user,
  });
}
```
#### We know the drill.  Let's write the view next:
```html
<%- include('partials/header') %>

<h3>Live Chat Room</h3>
<p>Users in the room:</p>
<!-- Notice the <ul> here that we'll be appending chatroom users to! -->
<ul id="chatters"></ul>
<input type="text" id="avatar" hidden name="avatar" value="<%= user.avatar %>">
<input type="text" hidden name="username" value="<%= user.name %>" id="username">
<input type="text" id="message">
<a class="btn btn-info" href="#" id="send_message">Send Message</a>
<!-- Oh, this is gonna be COOL!  We're gonna display when someone is typing! -->
<p id="isTyping"></p>
<div id="chatroom"></div>
<!-- This is where we'll loop over the chats with a forEach -->

<!-- We need to bring in a JavaScript file for this!!! -->
<script src="/javascripts/chat.js"></script>
<%- include('partials/footer') %>
```
#### Because we'll need to run JavaScript client-side, we'll need to add a script file to be loaded into our view whenever we navigate to the 'chat room' view.  Make sure it lives inside a directory within the public folder named 'scripts.'
# WARNING:  YOU ARE ABOUT TO SEE CODE THAT YOU USED IN UNIT 1.  DO NOT BE AFRAID!!!
```js
// First, we need to define our socket as the io we've exported on our server
let socket = io()

// OMG, CACHED ELEMENT REFERENCES?!?!? NO WAI!!!!
let message = document.getElementById("message");
let username = document.getElementById("username");
let send_message = document.getElementById("send_message");
let chatroom = document.getElementById("chatroom");
let avatar = document.getElementById("avatar");
let isTyping = document.getElementById("isTyping");
let chatters = document.getElementById("chatters");

// Event listeners (No, you're not having a flashback.  Everything will be ok!)

  
  // When 'send message' is clicked, emit a message containing the chat info to the server

  // When a user presses the 'Enter' key, emit a message containing the chat info to the server

  // When a user presses a key while typing in the 'message' element, send the user's name to the server

// Socket events

  // Define/execute a function to get the username from the server so that it can be broadcast on connection

  // When the socket receives an updated chat list, re-render the list of users connected

  // When a user enters the room, play a sound

  // When a user leaves the room, play a sound

  // When someone is typing (something we'll need the server to tell us), adjust the 'isTyping' element to reflect that

  // When a new message is posted, play a sound, update the newMessage element with the message/user info, and add the message to the database (we'll check server-side to make sure the message is only posted once, by checking the id of the user making the post)
```
#### We've got quite the list to accomplish...  Let's play around with some of the basic stuff first.  Let's knock out the sounds for when a user enters/exits a room:
```js
// io.js

const io = require('socket.io')()


let chatters = {}

io.on('connection', (socket) => {
  
  socket.on('register-user', () => {
    io.emit('user-enter')
  });

  socket.on('disconnect', () => {
    io.emit('user-exit')
  });
})

module.exports = io

```
#### Let's go write the matching socket.on methods on the client-side:
```js
// chat.js
socket.on("user-enter", () => {
  enterAudio.play();
});

socket.on("user-exit", () => {
  exitAudio.play();
});
```
#### See where we're going with this?  Let's add a function that loads the user info when the script loads and emits that to the server:

```js
// chat.js

function getUserName() {
  fetch("/users/getName").then((response) => {
    return response.json().then((data) => {
      socket.emit("register-user", data);
    });
  });
}

getUserName();
```
#### Whooooa, there!  That's a route we don't have yet.  Let's go add it to routes/users.js:
```js
router.get("/getName", isLoggedIn, usersCtrl.getName);
```
#### Then a matching function:
```js
function getName(req, res) {
  res.json(req.user.name);
}
```
#### Seriously?  That may be the shortest controller function ever.  Now that we've got our user's name, we need to go add the 'register-user' socket listener in io.js.  Let's add an item to update the chatter-list, too!:
```js
 socket.on('register-user', (username) => {
    chatters[socket.id] = username;
    io.emit('update-chatter-list', Object.keys(chatters).map(id => chatters[id]));
    io.emit('user-enter')
  });

  socket.on('disconnect', () => {
    delete chatters[socket.id];
    io.emit('user-exit')
    io.emit('update-chatter-list', Object.keys(chatters).map(id => chatters[id]));
  });

```
#### Back to chat.js to make the matching listener to update the page:
```js
socket.on("update-chatter-list", (data) => {
  var chatterList = "<li>" + data.join("</li><li>") + "</li>";
  chatters.innerHTML = chatterList;
});
```
#### Let's put in our '... is typing...' functionality next, now that we have the user name!:
```js
// chat.js
message.addEventListener("keypress", () => {
  socket.emit("typing", { username: username.value });
});
```
#### And we'll match it with a broadcast emitter (this will send it to all clients EXCEPT the one initiating it):
```js
// io.js
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', {username: data.username})
  })
```
#### Now, for the magic to happen we'll need to add a final socket.on to our chat.js and render the '... is typing...' message on the page:
```js
// chat.js

socket.on("typing", (data) => {
  isTyping.innerText = `${data.username} is typing...`;
});
```
#### Sweet!  All that's left is posting the message and having the data persist to the database!  Let's start with the client-side event:
```js
// chat.js

socket.on("new_message", (data) => {
  isTyping.innerText = "";
  messageAudio.play();
  let newMessage = document.createElement("p");
  newMessage.innerHTML = `<p><img id="avatarPhoto" height="30" src="${data.avatar}" alt=""> ${data.username}: ${data.message}</p>`;
  chatroom.prepend(newMessage);
  fetch("/chatroom", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      avatar: data.avatar,
      username: data.username,
      message: data.message,
    }),
  });
});
```
#### That's a route!!!  Let's write it out:
```js
router.post('/', isLoggedIn, chatCtrl.postChat);
```
#### Then the function:
```js
function postChat(req, res) {
  if (req.body.username === req.user.name) {
    Chat.create(req.body).then(() => {
      res.status(201).send("Added");
    });
  } else {
    res.status(208).send("Already added");
  }
}
```
#### Notice how we're preventing multiple entries by checking to make sure the person posting is the person currently logged in!  We're handling the data being stored in the database, let's go add the last emitter on the server:
```js
// io.js

  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', {message: data.message, username: data.username, avatar: data.avatar})
  })
```
#### The final piece of this application's giant puzzle is to update the chatRoom function to display the last 150 (or so) messages when the chat room is first loaded, that way the user can get in on the most relevant conversation:
```js
function chatRoom(req, res) {
  Chat.find({})
    .sort({ _id: -1 })
    .limit(150)
    .then((chats) => {
      res.render("chatroom", {
        title: "Chat Room",
        user: req.user,
        chats: chats,
      });
    });
}
```
#### IT'S OVER!!!!!!
