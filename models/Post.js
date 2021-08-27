const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    countLikes: {
      type: Number,
    },
  },
  { timestamps: true }
);

postSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("Post", postSchema);
