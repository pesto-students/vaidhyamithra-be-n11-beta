const Blog = require("../models/blog.model");
const mongoose = require("mongoose");

exports.getBlogById = async (req, res) => {
  var blogId = requireObjectId(req.params.id);
  if (!blogId) return res.status(500).send({ message: "Invalid blog id" });
  try {
    const blog = await Blog.aggregate(getQuery({ _id: blogId }));
    if (!blog)
      return res
        .status(500)
        .send({ message: "Blog not found with the id:" + blogId });
    res.status(200).send(blog);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const requireObjectId = (id) => {
  try {
    return mongoose.Types.ObjectId(id);
  } catch (error) {
    return error;
  }
};

const getQuery = (matchCondition) => {
  return [
    {
      $match: matchCondition,
    },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $unwind: "$authorDetails",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        authorId: 1,
        tags: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        "authorDetails._id": 1,
        "authorDetails.name": 1,
      },
    },
  ];
};

exports.getBlogsByTags = async (req, res) => {
  var tags = req.body.tags;
  if (!tags) return res.status(500).send({ message: "Not a valid tags" });
  try {
    const blogs = await Blog.aggregate(getQuery({ tags: { $in: tags } }));
    if (!blogs) return res.status(404).send({ message: "Blogs are not found" });
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getBlogsByAuthor = async (req, res) => {
  var authorId = requireObjectId(req.body.authorId);
  try {
    const blogs = await Blog.aggregate(getQuery({ authorId: authorId }));
    if (!blogs)
      return res
        .status(404)
        .send({ message: "Blogs are not found with the AuthorId:", authorId });
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.insertBlog = (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId,
    tags: req.body.tags,
    status: req.body.status,
  });

  blog
    .save()
    .then((savedBlog) => {
      res.status(200).send(savedBlog);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.updateBlog = (req, res) => {
  const blog = new Blog({
    _id: req.params.blogId,
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId,
    tags: req.body.tags,
    status: req.body.status,
  });

  Blog.findByIdAndUpdate(req.params.blogId, blog, { new: true })
    .then((resultBlog) => {
      if (!resultBlog) {
        return res
          .status(404)
          .send({ message: "Blog not found with the id:" + req.params.blogId });
      }
      res.send(resultBlog);
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
};
