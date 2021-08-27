const mongoose = require("mongoose");

var Post = require("../models/Post");
const User = require("../models/User");
const response = require("../utils/response");

exports.createPost = async (req, res) => {
  const { text, photo } = req.body;

  const postData = new Post({
    text,
    photo,
    posted_by: req.user.user_id,
  });
  postData
    .save()
    .then((result) => {
      res.send(
        response(null, { post: result }, "Post created successfully", 200)
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.likePost = async (req, res) => {
  const is_liked_already = await Post.findOne({
    $and: [{ _id: req.body.postId }, { likes: { $in: [req.user.user_id] } }],
  });

  if (is_liked_already) {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user.user_id },
        $inc: { countLikes: -1 },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.send(
          response(
            null,
            { unliked_post: result },
            "You have unliked the post",
            200
          )
        );
      }
    });
  } else {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user.user_id },
        $inc: { countLikes: 1 },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.send(
          response(null, { liked_post: result }, "You have liked the post", 200)
        );
      }
    });
  }
};

exports.getAllPosts = async (req, res) => {
  var postData = Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "posted_by",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        profile_media: { $arrayElemAt: ["$user.profile_media", 0] },
        username: { $arrayElemAt: ["$user.username", 0] },
        text: 1,
        photo: 1,
        likes: 1,
        posted_by: 1,
        countLikes: 1,
      },
    },
  ]);

  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
  };
  Post.aggregatePaginate(postData, options)
    .then((results) => {
      res.send(response(null, { posts: results }, "Post Details", 200));
    })
    .catch((err) => {
      res.send(response(err, null, "Error!!", 500));
    });
};

exports.editPost = async (req, res) => {
  try {
    const _id = req.params.id;
    let post_exist = await Post.findOne({ _id });
    if (post_exist) {
      const updatedPostData = await Post.findByIdAndUpdate(
        _id,
        { text: req.body.text },
        {
          new: true,
          upsert: true,
          timestamps: { createdAt: false, updatedAt: true },
        }
      );
      res.send(
        response(
          null,
          { updatedPosts: updatedPostData },
          "Post Details updated succesfully",
          200
        )
      );
    } else {
      res.send(response(null, null, "This post doesn't exist"));
    }
  } catch (error) {
    res.send(response(error, null, "Something went wrong!", 500));
  }
};

exports.deletePost = async (req, res) => {
  try {
    const _id = req.params.id;
    let post_exist = await Post.findOne({ _id });
    if (post_exist) {
      const deletedPost = await Post.deleteOne({ _id });
      res.send(
        response(null, { deletedPost }, "Post deleted succesfully", 200)
      );
    } else {
      res.send(response(null, null, "This post doesn't exists", 500));
    }
  } catch (error) {
    res.send(response(error, null, "Something went wrong!", 500));
  }
};
