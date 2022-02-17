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

router
  .route('/')
  .get(getAllThoughts)
  .post(addThought);

router
  .route('/:id') // may have to change this
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughId/reactions/:reactionId').delete(removeReaction);