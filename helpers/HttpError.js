// Стандартні message для status
// Якщо передається тільки status, підставиться відповідний message
const messageList = {
  400: "Bad Request",
  401: "Unathorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const HttpError = (status, message = messageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpError;
