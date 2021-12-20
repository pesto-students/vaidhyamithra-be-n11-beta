const authJwt = require("../config/authJwt");

module.exports = (app) => {
  const blogController = require("../controllers/blog.controller");

  app.get("/blog/:id", blogController.getBlogById);

  app.post("/blogsByTags", blogController.getBlogsByTags);

  app.get(
    "/blogsByAuthor/:id",
    [authJwt.verifyToken],
    blogController.getBlogsByAuthor
  );

  app.post("/blog", 
    [authJwt.verifyToken], 
    blogController.insertBlog
  );

  app.put("/blog/:blogId", 
    [authJwt.verifyToken], 
    blogController.updateBlog
  );
};
