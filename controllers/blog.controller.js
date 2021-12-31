const Blog = require("../models/blog.model");
const BookMark = require("../models/bookMark.model");
const mongoose = require("mongoose");

exports.getBlogById = async (req, res) => {
  try {
    var blogId = requireObjectId(req.params.id);
  } catch (error) {
    return res.status(404).send({ message: "Invalid blog Id" });
  }

  try {
    const blog = await Blog.aggregate(getQuery({ _id: blogId }, true));
    if (blog.length === 0)
      return res
        .status(404)
        .send({ message: "Blog not found with the id:" + blogId });
    res.status(200).send(blog);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const requireObjectId = (id) => {
  return mongoose.Types.ObjectId(id);
};

const getQuery = (matchCondition, requireContent) => {
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
      $sort: { createdAt: -1 },
    },
    {
      $project: requireContent ? {
        _id: 1,
        title: 1,
        content: 1,
        authorId: 1,
        tags: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        description: 1,
        imgUrl: 1,
        "authorDetails._id": 1,
        "authorDetails.name": 1,
      }: {
        content: 0,
        "authorDetails.password": 0,
        "authorDetails.email":0,
        "authorDetails.about":0,
        "authorDetails.interests":0
      }
    },
  ];
};

exports.getAllBlogs = async (req, res) => {
  const page = parseInt(req.body.pageNumber);
  const limit = parseInt(req.body.pageSize);
  const skipIndex = (page - 1) * limit;
  try {
    const blogs = await Blog.aggregate([
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
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          authorId: 1,
          tags: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          description: 1,
          imgUrl: 1,
          "authorDetails._id": 1,
          "authorDetails.name": 1,
          "authorDetails.imgUrl": 1
        },
      },
      {
        $facet: {
          paginatedResults: [{ $skip: skipIndex }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $addFields: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
      {
        $project: {
          paginatedResults: 1,
          totalCount: 1,
        },
      },
    ]);

    res.status(200).send(blogs[0]);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getLatestTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 20,
      },
      {
        $project: {
          _id: 0,
          tags: 1,
        },
      },
    ]);

    let values = [];
    tags.forEach((tag) => {
      values.push(tag.tags);
    });
    let uniqueKeys = [...new Set(values)];
    res.status(200).send(uniqueKeys);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getBlogsByTags = async (req, res) => {
  var tags = req.body.tags;
  if (!tags) return res.status(500).send({ message: "Not a valid tags" });
  try {
    const blogs = await Blog.aggregate(getQuery({ tags: { $in: tags } }, false));
    if (!blogs) return res.status(404).send({ message: "Blogs are not found" });
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getPublishedBlogsByAuthor = async (req, res) => {
  var authorId = requireObjectId(req.params.authorId);
  try {
    const blogs = await Blog.aggregate(
      getQuery({ $and: [{ authorId: authorId }, { status: "published" }] }, false)
    );
    if (!blogs)
      return res
        .status(404)
        .send({ message: "Blogs are not found with the AuthorId:", authorId });
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getDraftBlogsByAuthor = async (req, res) => {
  var authorId = requireObjectId(req.params.authorId);
  try {
    const blogs = await Blog.aggregate(
      getQuery({ $and: [{ authorId: authorId }, { status: "draft" }] }, false)
    );
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
    imgUrl: req.body.imgUrl,
    description: req.body.description,
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
    imgUrl: req.body.imgUrl,
    description: req.body.description,
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

exports.getSavedBlogs = async (req, res) => {
  var userId = requireObjectId(req.params.userId);
  if (!userId) res.status(500).send({ message: "Invalid userId:", userId });
  try {
    const blogs = await BookMark.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: "blogs",
          localField: "blogId",
          foreignField: "_id",
          as: "blogDetails",
        },
      },
      {
        $unwind: "$blogDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "blogDetails.authorId",
          foreignField: "_id",
          as: "blogDetails.authorDetails",
        },
      },
      {
        $unwind: "$blogDetails.authorDetails",
      },
      {
        $project: {
          _id: 1,
          "blogDetails._id": 1,
          "blogDetails.title": 1,
          "blogDetails.description": 1,
          "blogDetails.authorId": 1,
          "blogDetails.tags": 1,
          "blogDetails.status": 1,
          "blogDetails.createdAt": 1,
          "blogDetails.updatedAt": 1,
          "blogDetails.imgUrl":1,
          "blogDetails.authorDetails.imgUrl":1,
          "blogDetails.authorDetails._id": 1,
          "blogDetails.authorDetails.name": 1,
        },
      },
    ]);
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getAuthorTags = async (req, res) => {
  var authorId = requireObjectId(req.params.authorId);
  try {
    const tags = await Blog.aggregate([
      {
        $match: { $and: [{ authorId: authorId }, { status: "published" }] },
      },
      {
        $unwind: "$tags",
      },
      {
        $project: {
          _id: 0,
          tags: 1,
        },
      },
    ]);

    let values = [];
    tags.forEach((tag) => {
      values.push(tag.tags);
    });
    let uniqueKeys = [...new Set(values)];

    res.status(200).send(uniqueKeys);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
