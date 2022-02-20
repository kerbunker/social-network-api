// connect to server and appropriate routes
const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// direct to appropriate routes
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

// export data
module.exports = router;