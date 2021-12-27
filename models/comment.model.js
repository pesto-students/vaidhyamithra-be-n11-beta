const mongoose = require("mongoose");
const CommentSchema = mongoose.Schema(
    {
        comment: String,
        userId: {type:mongoose.Schema.ObjectId},
        blogId: {type:mongoose.Schema.ObjectId}
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Comment", CommentSchema);