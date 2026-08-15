const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const { getItems } = require("../controllers/clothingItems");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../errors/not-found-error");
const { validateSignup, validateSignin } = require("../middlewares/validation");

router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);
router.get("/items", getItems);
router.use("/items", auth, clothingItemRouter);
router.use("/users", auth, userRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
