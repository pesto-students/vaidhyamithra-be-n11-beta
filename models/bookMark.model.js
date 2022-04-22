const mongoose = require("mongoose");
const BookMarkSchema = mongoose.Schema(
  { 
    userId: {type:mongoose.Schema.ObjectId},
    blogId: {type:mongoose.Schema.ObjectId},
    createdAt: String,
    updatedAt: String
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("BookMark", BookMarkSchema);
