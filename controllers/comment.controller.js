const Comment = require("../models/comment.model");
const mongoose = require("mongoose");

const requireObjectId = (id) => {
  return mongoose.Types.ObjectId(id);
};

exports.blogComments = async (req, res) => {
  var blogId = requireObjectId(req.params.blogId);
  try {
    const comments = await Comment.aggregate([
      {
        $match: { blogId: blogId },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
            _id: 1,
            comment: 1,
            userId:1,
            blogId: 1,
            createdAt: 1,
            updatedAt:1,
            "userDetails._id":1,
            "userDetails.name":1
        }
      }
    ]);

    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.insertComment = async (req,res) => {
    const comment = new Comment({
        comment: req.body.comment,
        userId: req.body.userId,
        blogId: req.body.blogId
    });
    try {
        const savedComment = await comment.save();
        res.status(200).send(savedComment);
    }
    catch(error) {
        res.status(500).send({ message: error });      
    }
}

exports.deleteComment = (req,res) => {
    var commentId = requireObjectId(req.params.commentId);
    Comment.deleteOne({id: commentId}).then(() => {
        res.status(200).send({message: "Deleted Successfully"});
    }).catch((error) => {
        res.send(500).send({message: error});
    })
}
