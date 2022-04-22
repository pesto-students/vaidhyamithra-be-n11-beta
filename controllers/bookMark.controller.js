const BookMark = require("../models/bookMark.model");
const mongoose = require("mongoose");

const requireObjectId = (id) => {
  return mongoose.Types.ObjectId(id);
};

exports.bookMarkBlog = async (req, res) => {
  const bookMark = new BookMark({
    userId: req.body.userId,
    blogId: req.body.blogId,
  });

  try {
    const savedBookMark = await bookMark.save();
    res.status(200).send(savedBookMark);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.deleteBookMark = async (req, res) => {
  try {
    var userId = requireObjectId(req.body.userId);
    var blogId = requireObjectId(req.body.blogId);
  } catch (error) {
    res.status(500).send({ message: error });
  }

  try {
    await BookMark.deleteOne({
      $and: [{ userId: userId }, { blogId: blogId }],
    });
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
