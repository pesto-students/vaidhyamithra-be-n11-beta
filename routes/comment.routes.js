const authJwt = require("../config/authJwt");

module.exports = (app) => {
  const commentController = require("../controllers/comment.controller");

  app.get("/getBlogComments/:blogId", commentController.blogComments);
  
  app.post(
    "/createComment",
    [authJwt.verifyToken],
    commentController.insertComment
  );
  
  app.delete(
    "/deleteComment/:commentId",
    [authJwt.verifyToken],
    commentController.deleteComment
  );
};
