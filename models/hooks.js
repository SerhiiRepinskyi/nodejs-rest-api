export const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  // 400 - Bad Request
  // 409 - "дубль" унікального поля
  error.status = status;
  next();
};

export const validateAtUpdate = function (next) {
  this.options.runValidators = true;
  next();
};
