export const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  // 400 - Bad Request
  // 409 - Conflict - "дубль" унікального поля
  next();
};

export const validateAtUpdate = function (next) {
  this.options.runValidators = true;
  next();
};
