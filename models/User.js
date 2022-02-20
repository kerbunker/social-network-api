const { Schema, model } = require("mongoose");
//const dateFormat = require('../utils/dateFormat');

// set up user data
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      // validate that email matches the format for an email address
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/]
    },
    thoughts: [
      {
        // connect to the thoughts schema
        type: Schema.Types.ObjectId,
        ref: "Thought"
      }
    ],
    friends: [
      {
        // connect to friends, which are just other users
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// gets the number of friends in the friends array
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
})

//exports user data
const User = model("User", UserSchema);
module.exports = User;