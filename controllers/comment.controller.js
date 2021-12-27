const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const requireObjectId = (id) => {
  return mongoose.Types.ObjectId(id);
};

const getQuery = (matchCondition) => {
  return [
    {
      $match: matchCondition,
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
        userId: 1,
        blogId: 1,
        createdAt: 1,
        updatedAt: 1,
        "userDetails._id": 1,
        "userDetails.name": 1,
      },
    },
  ];
};

exports.blogComments = async (req, res) => {
  var blogId = requireObjectId(req.params.blogId);
  try {
    const comments = await Comment.aggregate(getQuery({ blogId: blogId }));

    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.insertComment = async (req, res) => {
  const comment = new Comment({
    comment: req.body.comment,
    userId: req.body.userId,
    blogId: req.body.blogId,
  });
  try {
    comment.save().then((savedComment) => {
      Comment.aggregate(getQuery({ blogId: savedComment.blogId })).then(
        (comments) => {
          res.status(200).send(comments);
        }
      );
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.deleteComment = (req, res) => {
  var commentId = requireObjectId(req.params.commentId);
  Comment.deleteOne({ id: commentId })
    .then(() => {
      res.status(200).send({ message: "Deleted Successfully" });
    })
    .catch((error) => {
      res.send(500).send({ message: error });
    });
};
