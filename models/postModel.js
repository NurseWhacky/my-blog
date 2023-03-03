const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title!'],
      unique: true,
      trim: true,
    },
    // slug: String,
    authorId: String,
    text: {
      type: String,
      required: [true, 'A post cannot be empty'],
      trim: true,
    },
    updatedOn: {
      type: Date,
      default: Date.now,
    },
    // wordCount: {
    //   type: Number,
    //   required: [true, 'Error: word count missing'],
    // },
    tags: {
      type: [String],
      // required: [true, 'A post must have at least 1 tag'],
      default: 'miscellaneous',
    },
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
      },
    ],
    rating: {
      type: Number,
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('url').get(function () {
  return `/post/${this._id}`;
});

postSchema.virtual('postTitleSlug').get(function () {
  return slugify(this.title, { 
    lower: true, 
    remove: /[*+~.()'"!:@]/g 
  });
});

postSchema.virtual('wordCount').get(function () {
  return this.text.trim().split(/\s/).length;
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
