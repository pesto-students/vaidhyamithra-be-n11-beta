const authJwt = require("../config/authJwt");

module.exports = (app) => {
  const tagController = require("../controllers/tag.controller");
  app.get("/getTags", tagController.getAllTags);
  app.post("/getTagsBySearchText", tagController.getTagsBySearchText);
  app.get("/getTagById/:id", tagController.getTagById);
  app.post("/createTag", [authJwt.verifyToken], tagController.insertTag);
};
