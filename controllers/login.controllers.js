const keyConfig = require("../config/key.config");
const User = require('../models/user.model.js');
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

exports.signUp = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      message: "User can not be empty",
    });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  // Save User in the database
  user
    .save()
    .then((data) => {
      res.status(200).send({message:"User Created Successfully"});
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({$or:[{email:email}]})
  .then(user => {
    if(!user)
    {
      return res.status(404).send({message: "User not found."});
    }
    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if(!passwordIsValid)
    {
        return res.status(401).send({message: "Invalid password"});
    }

    var token = jwt.sign({id: user.id}, keyConfig.secret_key, {expiresIn: 7200});

    res.status(200).send({
        id: user.id,
        userName: user.name,
        accessToken: token
    })
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  });
};
