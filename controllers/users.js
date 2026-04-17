const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const SALT_ROUNDS = 10;

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const {
    name, avatar, email, password,
  } = req.body;

  if (
    typeof name !== "string"
    || name.trim() === ""
    || typeof avatar !== "string"
    || avatar.trim() === ""
    || typeof email !== "string"
    || email.trim() === ""
    || typeof password !== "string"
    || password.trim() === ""
  ) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Invalid data passed to create a user" });
  }

  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to create a user" });
      }

      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "A user with that email already exists" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string"
    || !validator.isEmail(email)
    || typeof password !== "string"
    || password.trim() === ""
  ) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Invalid data passed to login" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "UnauthorizedError") {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateProfile = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  if (
    typeof name !== "string"
    || name.trim() === ""
    || typeof avatar !== "string"
    || avatar.trim() === ""
  ) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Invalid data passed to update profile" });
  }

  return User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to update profile" });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
