const mongoose = require("mongoose");
const BlogSchema = mongoose.Schema(
  {
    title: String,
    content: String, 
    authorId: String,
    tags: [String], //Tags should be array of ids 
    status: String, //Check enum in mongodb [draft, published]
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Blog", BlogSchema);
