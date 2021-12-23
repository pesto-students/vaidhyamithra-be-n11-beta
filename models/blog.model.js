const mongoose = require("mongoose");
const BlogSchema = mongoose.Schema(
  {
    title: String,
    content: String, 
    authorId: {type:mongoose.Schema.ObjectId},
    tags: [String], //Tags should be array of ids 
    status: String, //Check enum in mongodb [draft, published]
    createdAt: String,
    updatedAt: String
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Blog", BlogSchema);
