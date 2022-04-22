const authJwt = require("../config/authJwt");

module.exports = (app) => {
  const loginController = require("../controllers/login.controllers");

  app.post("/signup", loginController.signUp);
  app.post("/login", loginController.login);

  app.get("/getUserInfo/:userId", loginController.getUserDetails);

  app.put(
    "/updateUserInfo",
    [authJwt.verifyToken],
    loginController.updateUserDetails
  );
};
