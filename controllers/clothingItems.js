const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(500).send({ message: "An error has occurred on the server" }));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(201).send(item))
    .catch(() => res.status(500).send({ message: "An error has occurred on the server" }));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Requested resource not found" });
      }

      return res.send(item);
    })
    .catch(() => res.status(500).send({ message: "An error has occurred on the server" }));
};

module.exports = { getItems, createItem, deleteItem };
