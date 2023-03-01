const express = require('express');
// controllers

// router
const router = express.Router();

// TODO: implement controllers
router.route('/').get(getAllPosts);

router.route('/').post(protect, restrictTo(['owner', 'guest']));
