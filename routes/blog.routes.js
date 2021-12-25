const authJwt = require("../config/authJwt");

module.exports = (app) => {
  const blogController = require("../controllers/blog.controller");

  app.get("/blog/:id", blogController.getBlogById);

  app.post("/blogsByTags", blogController.getBlogsByTags);

  app.post(
    "/blogsByAuthor",
    [authJwt.verifyToken],
    blogController.getBlogsByAuthor
  );

  app.post("/blog", [authJwt.verifyToken], blogController.insertBlog);

  app.put("/blog/:blogId", [authJwt.verifyToken], blogController.updateBlog);

  app.get(
    "/getSavedBlogs/:userId",
    [authJwt.verifyToken],
    blogController.getSavedBlogs
  );

  app.get(
    "/getTagsByAuthorId/:authorId",
    [authJwt.verifyToken],
    blogController.getAuthorTags
  )
};
