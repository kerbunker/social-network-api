const { User } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      // .populate({
      //   path: 'friends',
      //   select: '-__v'
      // })
      // .populate({
      //   path: 'thoughts',
      //   select: '-__v'
      // })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => {
        // if no user is found, send a 404 error
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create a user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // update user given an id with the given 'body' data
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true})
      .then(dbUserData => {
        if (!dbUserData) {
          // return an error if the id did not match a user
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete a user and associated thoughts
  deleteUser({ params }, res) {
    // find a user
    User.findById(params.id)
      .then(dbUserData => {
        if (!dbUserData) {
          // send error if no user found
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        // delete the thoughts in the user's thoughts array
        Thought.deleteMany({ _id: { $in: dbUserData.thoughts } })
          // after thoughts deleted, delete user
          .then(dbUserData.delete())
          // send success message
          .then(() => res.status(202).json({ message: 'User and associated thoughts deleted.' }));
      })
      .catch(err => res.status(400).json(err));
  },

  // Add a friend to user friend array
  addFriend({ params }, res) {
    // finds the user by the given id
    User.findOneAndUpdate(
      { _id: params.userId },
      // adds the given friend id to the friends array in the user data
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          // sends error if no user found
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        // returns the updated user data
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Delete friend from friends array
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      // find a user by the user id
      { _id: params.userId },
      // pull the friend with the given friendId from the friends array
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      // return the updated user data
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = userController;