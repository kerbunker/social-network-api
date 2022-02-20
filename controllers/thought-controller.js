const { Thought, User } = require('../models');

const thoughtController = {
  // Get all the thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      // .populate({
      //   path: 'reactions',
      //   select: '-__v'
      // })
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Get a single thought with the given thoughId
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .populate({
        // get the associated reactions data
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          // return an error if no thought found
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Add a thought and connect to user
  addThought({ body }, res) {
    // create a new thought
    Thought.create(body)
      .then(({ _id }) => {
        // find the user with the given id
        return User.findOneAndUpdate(
          { _id: body.userId },
          // add the thought to the thoughts array of the user
          { $push: { thoughts: _id }},
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        // return the updated user data with the new thought
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Update a thought with the given id and updated body
  updateThought({ params, body }, res) {
    // find the thought by the id and update
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true})
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        // return the updated thought data
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete the thought with the given id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // Add a reaction to the given thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      // find the thought with the given id
      { _id: params.thoughtId },
      // add the reaction to the thought's reaction array
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        // return the updated thought data
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  // Remove a reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      // find the thought by thoughtId
      { _id: params.thoughtId },
      // remove the reaction from the array
      { $pull: { reactions: { reactionId: params.reactionId }}},
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        // return the updated thought
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  }
};

module.exports = thoughtController;