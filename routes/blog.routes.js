const authJwt = require("../config/authJwt");

module.exports = (app) => {
  const blogController = require("../controllers/blog.controller");

  app.get("/blog/:id", blogController.getBlogById);

  app.post("/blogsByTags", blogController.getBlogsByTags);

  app.get(
    "/blogsByAuthor/published/:authorId",
    blogController.getPublishedBlogsByAuthor
  );

  app.get(
    "/blogsByAuthor/draft/:authorId",
    [authJwt.verifyToken],
    blogController.getDraftBlogsByAuthor
  );

  app.post("/blog", [authJwt.verifyToken], blogController.insertBlog);

  app.put("/blog/:blogId", [authJwt.verifyToken], blogController.updateBlog);

  app.get(
    "/getSavedBlogs/:userId",
    [authJwt.verifyToken],
    blogController.getSavedBlogs
  );

  app.get("/getTagsByAuthorId/:authorId", blogController.getAuthorTags);

  app.post("/getLatestBlogs", blogController.getAllBlogs);

  app.get("/getLatestTags", blogController.getLatestTags);
};
