import bcrypt from "bcryptjs"; // хешування/верифікація пароля
import jwt from "jsonwebtoken"; // шифрування/розшифровування токена
import gravatar from "gravatar"; // створення тимчасової аватарки
import path from "path";
import fs from "fs/promises"; // робота з файлами

import Jimp from "jimp";

import { User } from "../models/user.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars"); // абсолютний шлях до папки з файлами avatars

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10); // хешування паролю, 10 - складність (сіль)
  const avatarURL = gravatar.url(email); // створення посилання на тимчасову аватарку

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password); // порівняння пароля, що прийшов (req.body) із захешованим паролем (з БД)
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
};

const updateStatusSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  res.json({ user: { email: user.email, subscription: user.subscription } });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempPath, originalname } = req.file; // tempPath - абсолютний шлях до файлу (з ім'ям та розширенням) в тимчасовій папці; originalname - ім'я файлу

  // 1 варіант - без обробки зображення за допомогою бібліотеки Jimp
  // const filename = `${_id}_${originalname}`; // створення унікального ім'я (з _id перед originalname)
  // const newPath = path.resolve(avatarsPath, filename); // новий абсолютний шлях (з ім'ям та розширенням), де буде зберігатися файл
  // await fs.rename(tempPath, newPath); // переміщення файлу з тимчасової папки "temp" в папку "public/avatars"
  // const avatarURL = path.join("avatars", filename); // створення відносного шляху (відносно корня проекту без урахування "public") для запису в модель user в БД
  // await User.findByIdAndUpdate(_id, { avatarURL });
  // res.json({
  //   avatarURL,
  // });

  // 2 варіант - з обробкою зображення за допомогою бібліотеки Jimp
  try {
    const uniqueFileName = `${_id}_${originalname}`; // створення унікального ім'я (з _id перед originalname)
    const newPath = path.join(avatarsPath, uniqueFileName); // новий абсолютний шлях (з ім'ям та розширенням), де буде зберігатися файл

    // Обробка зображення за допомогою бібліотеки Jimp
    const avatar = await Jimp.read(tempPath);
    avatar.resize(250, 250); // зміна розміру зображення на 250x250 пікселів
    await avatar.writeAsync(newPath); // збереження після обробки файлу в папку "public/avatars"

    await fs.unlink(tempPath); // видалення файлу з папки "temp"
    const avatarURL = path.join("avatars", uniqueFileName); // створення відносного шляху (відносно корня проекту без урахування "public") для запису в модель user в БД
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({
      avatarURL,
    });
  } catch (error) {
    console.error(error);
    throw HttpError(500, "Failed to process the image");
  }
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateStatusSubscription: ctrlWrapper(updateStatusSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
