const Joi = require("joi");

// Joi-schema - опис вимог до об'єкту body
const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
    "string.empty": "name cannot be empty",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
    "string.empty": "email cannot be empty",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
    "string.empty": "phone cannot be empty",
  }), // Додати регулярний вираз
});

module.exports = { addSchema };
