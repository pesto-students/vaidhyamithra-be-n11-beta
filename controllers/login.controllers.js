const keyConfig = require("../config/key.config");
const User = require("../models/user.model.js");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      message: "User details can not be empty",
    });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({ message: "Already exists in Vaidhyamitra, please login" });
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    isDoctor: req.body.isDoctor,
    interests: req.body.interests,
    imgUrl: req.body.imgUrl,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  // Save User in the database
  try {
    let savedData = await user.save();
    var token = jwt.sign({ id: savedData._id }, keyConfig.secret_key, {
      expiresIn: 7200,
    });
    res.status(200).send({
      id: savedData._id,
      userName: savedData.name,
      email: savedData.email,
      isDoctor: savedData.isDoctor,
      accessToken: token,
      about: savedData.about,
      imgUrl: savedData.imgUrl,
      interests: savedData.interests,
    });
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};

exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ $or: [{ email: email }] })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid password" });
      }

      var token = jwt.sign({ id: user.id }, keyConfig.secret_key, {
        expiresIn: 28800,
      });

      res.status(200).send({
        id: user.id,
        userName: user.name,
        email: user.email,
        isDoctor: user.isDoctor,
        accessToken: token,
        about: user.about,
        imgUrl: user.imgUrl,
        interests: user.interests
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.updateUserDetails = async (req, res) => {
  var userId = req.body.userId;
  var about = req.body.about;
  var interests = req.body.interests;
  var name = req.body.name;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(400)
        .send({ message: "User not found with the Id:", userId });
    User.updateOne(
      { _id: userId },
      { $set: { about: about, interests: interests, name: name } }
    ).then(() => {
      User.findById(userId).then((updatedUserDetails) => {
        let userInfo = {
          id: updatedUserDetails._id,
          userName: updatedUserDetails.name,
          email: updatedUserDetails.email,
          about: updatedUserDetails.about,
          imgUrl: updatedUserDetails.imgUrl,
          isDoctor: updatedUserDetails.isDoctor,
          interests: updatedUserDetails.interests,
        };
        res.status(200).send(userInfo);
      });
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getUserDetails = async (req, res) => {
  var userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(400)
        .send({ message: "User not found with the Id:", userId });
    let userInfo = {
      id: user._id,
      userName: user.name,
      email: user.email,
      about: user.about,
      imgUrl: user.imgUrl,
      isDoctor: user.isDoctor,
      interests: user.interests,
    };
    res.status(200).send(userInfo);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
