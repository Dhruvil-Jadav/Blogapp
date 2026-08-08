const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true, maxlength: 200 },
    content:  { type: String, required: true },
    tags:     [String],
    authorId: { type: Number, required: true, index: true }, // ← MySQL users.id
  },
  { timestamps: true }   // adds createdAt & updatedAt
);

module.exports = mongoose.model('Post', postSchema);