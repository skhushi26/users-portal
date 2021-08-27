const express = require("express");

const postController = require("../controller/postController");
const router = express.Router();
const authorize = require("../utils/requireLogin");
const {
  createPostSchema,
  likePostSchema,
} = require("../payloads/postValidation");

createPostSchema,
  router.post(
    "/create-post",
    authorize(),
    createPostSchema,
    postController.createPost
  );

router.patch("/like", authorize(), likePostSchema, postController.likePost);

router.get("/post-details", authorize(), postController.getAllPosts);

router.patch("/update-post/:id", authorize(), postController.editPost);

router.delete("/delete-post/:id", authorize(), postController.deletePost);

module.exports = router;
