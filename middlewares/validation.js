const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const urlSchema = Joi.string().required().custom(validateUrl);
const objectIdSchema = Joi.string().hex().length(24).required();

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: urlSchema,
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: urlSchema,
  }),
});

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: urlSchema,
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: objectIdSchema,
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateProfile,
  validateCreateItem,
  validateItemId,
};
