const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "An error has occurred on the server" }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.send(user);
    })
    .catch(() => res.status(500).send({ message: "An error has occurred on the server" }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch(() => res.status(500).send({ message: "An error has occurred on the server" }));
};

module.exports = { getUsers, getUser, createUser };
