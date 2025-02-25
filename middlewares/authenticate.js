import jwt from "jsonwebtoken";

import { User } from "../models/user.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    // якщо немає користувача за id в БД або в нього немає токена або токен користувача з БД не дорівнює токену, що прислали
    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }
    req.user = user; // додавання в req.user інформації про конкретного user (для запису у властивість owner)
    next();
  } catch {
    throw HttpError(401, "Not authorized");
  }
};

export default ctrlWrapper(authenticate);
