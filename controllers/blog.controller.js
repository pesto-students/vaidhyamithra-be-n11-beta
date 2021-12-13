const Blog = require("../models/blog.model");

exports.getBlogById = (req, res) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      if (!blog)
        return res.status(404).send({
          message: "Blog not found with the id:" + req.params.id,
        });
      res.send(blog);
    })
    .catch((error) => {
      return res.status(500).send({ message: error });
    });
};

exports.getBlogsByTags = (req, res) => {
  var tags = req.body.tags;
  if(!tags)
    return res.status(500).send({message:"Not a valid tags"});

  Blog.find({ tags: {$in : tags} })
    .then((blogs) => {
      if (!blogs)
        return res.status(404).send({ message: "Blogs are not found" });
      res.status(200).send(blogs);
    })
    .catch((error) => {
      return res.status(500).send({ message: error });
    });
};

exports.getBlogsByAuthor = (req, res) => {
  var authorId = req.body.authorId;
  Blog.find({ authorId: authorId }).then((blogs) => {
    if (!blogs) return res.status(404).send({ message: "Blogs are not found" });
    res.status(200).send(blogs);
  });
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
    .then(() => {
      res.status(200).send({ Message: "Blog created successfully" });
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

    Blog.findByIdAndUpdate(
        req.params.blogId,
        blog,
        {new: true}
    )
    .then((resultBlog) => {
        if(!resultBlog)
        {
            return res.status(404).send({message: "Blog not found with the id:" + req.params.blogId});
        }
        res.send(resultBlog);
    })
    .catch((error) => {
        res.status(500).send({message: error});
    })
}

