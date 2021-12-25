const authJwt = require("../config/authJwt");

module.exports = (app) => {
  const bookMarkController = require("../controllers/bookMark.controller");

  app.post(
    "/saveBookMark",
    [authJwt.verifyToken],
    bookMarkController.bookMarkBlog
  );
  app.post(
    "/deleteBookMark",
    [authJwt.verifyToken],
    bookMarkController.deleteBookMark
  );
};
