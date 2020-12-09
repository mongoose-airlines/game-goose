const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchListSchema = new Schema({
  title: String,
  slug: String,
  released: Date
}, {
  timestamps: true
})

const userSchema = new Schema(
  {
    name: String,
    alias: String,
    email: String,
    avatar: String,
    googleId: String,
    bio: String,
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    watchList: [watchListSchema]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
