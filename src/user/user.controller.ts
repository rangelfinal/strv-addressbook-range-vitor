/* eslint-disable consistent-return */
import Router from "koa-router";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DI, JWTSecret } from "../server";

const saltRounds = 10;

const userController = new Router({ prefix: "/user" });

userController.post("/login", async (context) => {
  const { email, password: userProvidedPassword } = context.request.body as {
    email: string;
    password: string;
  };

  // Find user by email
  const dbUser = await DI.userRepository.findOne({ email });

  if (!dbUser) {
    // User not found
    return context.throw(400, "Wrong user or password");
  }

  // Check if user provided password matches db password
  const correctPassword = await bcrypt.compare(
    userProvidedPassword,
    dbUser.hashedPassword
  );

  if (!correctPassword) {
    // Password did not match
    return context.throw(400, "Wrong user or password");
  }

  // Create jwt token
  const token = jwt.sign({ email }, JWTSecret, { expiresIn: "7 days" });

  context.body = { token };
});

userController.post("/register", async (context) => {
  const { email, password: userProvidedPassword } = context.request.body as {
    email: string;
    password: string;
  };

  const hashedPassword = await bcrypt.hash(userProvidedPassword, saltRounds);

  // Create and save user to db
  const user = DI.userRepository.create({ email, hashedPassword });
  await DI.userRepository.persistAndFlush(user);

  // Create jwt token
  const token = jwt.sign({ email: user.email }, JWTSecret, {
    expiresIn: "7 days",
  });

  context.body = { email: user.email, token };
});

export { userController };
