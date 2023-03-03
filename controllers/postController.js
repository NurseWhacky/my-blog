const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      post,
    },
  });
});
