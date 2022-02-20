// connect to the created express server and routes folder
const router = require('express').Router();
const apiRoutes = require('./api');

// direct to appropriate routes folder
router.use('/api', apiRoutes);

// gives an error if incorrect route used
router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

// export data
module.exports = router;