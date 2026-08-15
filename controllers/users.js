const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");
const NotFoundError = require("../errors/not-found-error");

const SALT_ROUNDS = 10;

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }

      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Invalid data passed to create a user")
        );
      }

      if (err.code === 11000) {
        return next(new ConflictError("A user with that email already exists"));
      }

      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(
          new BadRequestError("Invalid data passed to update profile")
        );
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }

      return next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
