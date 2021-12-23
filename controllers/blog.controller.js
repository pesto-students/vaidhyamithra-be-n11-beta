const Blog = require("../models/blog.model");

exports.getBlogById = async (req, res) => {
  var blogId = req.params.id;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return (
        res.status(500).
        send({ message: "Blog not found with the id:" + blogId })
      );
    res.status(200).send(blog);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getBlogsByTags = async (req, res) => {
  var tags = req.body.tags;
  if (!tags) return res.status(500).send({ message: "Not a valid tags" });
  try {
    const blogs = await Blog.find({ tags: { $in: tags } });
    if (!blogs) return res.status(404).send({ message: "Blogs are not found" });
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getBlogsByAuthor = async (req, res) => {
  var authorId = req.body.authorId;
  try {
    const blogs = await Blog.find({ authorId: authorId });
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
