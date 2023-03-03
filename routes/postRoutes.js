const express = require('express');
// controllers
const postController = require('../controllers/postController');

// router
const router = express.Router();

// TODO: implement controllers
router.route('/').get(postController.getAllPosts)
router.route('/').post(postController.createPost);


// router.route('/').post(protect, restrictTo(['owner', 'guest']));
// router.route

module.exports = router;
