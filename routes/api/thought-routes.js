// connect to server and routes
const router = require("express").Router();
const {
  getAllThoughts,
  getThoughtById,
  addThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction
} = require("../../controllers/thought-controller");

// set up GET all thoughts and create thought routes
router
  .route('/')
  .get(getAllThoughts)
  .post(addThought);

// set up GET thought by id, update, and delete routes
router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// set up reactions routes
router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

// export data
module.exports = router;