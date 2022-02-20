//connect to router and inport data for routes
const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/user-controller');

// Set up GET all and POST at /api/users
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

// Set up GET by id, update, and delete at /api/users/:id
router
  .route('/:id') // may have to change this
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// set up friend routes
router
  .route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);

  // export data
module.exports = router;