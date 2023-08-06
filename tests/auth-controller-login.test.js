import mongoose from "mongoose";
import request from "supertest"; // робить http-запит на бекенді
import "dotenv/config";

import app from "../app.js";
import { User } from "../models/user.js";

const { PORT, DB_HOST_TEST } = process.env;

// - the response must have a status code of "200"
// - the response must return a "token"
// - the response must contain object "user" with 2 fields: "email" and "subscription" with data type "String"

describe("test login route", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // Очистка БД
  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test login with correct data", async () => {
    // Тіло запиту
    const loginData = {
      email: "my-email@ukr.net",
      password: "123456",
    };

    // Створення нового користувача в базі даних перед перевіркою login
    const newUser = await User.create({
      email: loginData.email,
      password: "$2a$10$8rqAcdQUIcCDdgXlCJF2IO1.4mOdoDAukT.uUpKqkJJ.9H4yCZPWC", // хешований пароль
      subscription: "starter",
      avatarURL:
        "avatars\\64ca6daca530a72f768d6437_fallout-new-vegas-vault-boy.jpg",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2E2ZGFjYTUzMGE3MmY3NjhkNjQzNyIsImlhdCI6MTY5MTI0ODgwNSwiZXhwIjoxNjkxMzMxNjA1fQ.nCUtlDHXfPlN8D5HdIj9F_XvaqbnHo2bpvwkV3xMB_s",
    });

    // Http-запит request, що повертає response = { statusCode, body }
    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(loginData);

    // === Перевірки ===
    // відповідь повина мати статус-код 200
    expect(statusCode).toBe(200);

    // у відповіді повинен повертатися токен
    expect(body).toHaveProperty("token");
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toEqual("string");

    // у відповіді повинен повертатися об'єкт user
    // з 2 полями email и subscription з типом даних String
    expect(body).toHaveProperty("user");
    expect(typeof body.user).toEqual("object");
    expect(body.user).toHaveProperty("email");
    expect(body.user).toHaveProperty("subscription");
    expect(typeof body.user.email).toEqual("string");
    expect(typeof body.user.subscription).toEqual("string");

    // у відповіді (body.user.email) повертатися той самий email, як і у тілі запиту (loginData.email)
    expect(body.user.email).toBe(loginData.email);

    // чи є user записаний в БД (ця перевірка необхідна при реєстрації)
    // чи email юзера (user.email) відповідає email при login (register) (loginData.email)
    const user = await User.findOne({ email: loginData.email });
    expect(user.email).toBe(loginData.email);
  });
});
