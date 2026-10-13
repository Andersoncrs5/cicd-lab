const mongoose = require("mongoose");

const options = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  options,
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  options,
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  options,
);

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  options,
);

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Category = mongoose.model("Category", categorySchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { User, Post, Category, Comment };
