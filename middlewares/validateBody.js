const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    if (!Object.keys(req.body).length) {
      next(HttpError(400, "missing fields"));
      // return res.status(400).json({ message: "missing fields" });
    }
    const { error } = schema.validate(req.body); // Метод validate перевіряє, чи об'єкт відповідає Joi-schema
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateBody;
