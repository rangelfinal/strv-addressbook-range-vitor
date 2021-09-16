import Router from "koa-router";
import bcrypt from "bcrypt";
import { DI } from "../server";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const secret = "2e610f6a-0f4f-4edf-9b3d-68b815262701"; // Temp fake secret for development

const userController = new Router();

userController.post("/login", async function (context) {
  const { email, password: userProvidedPassword } = context.body;

  // Find user by email
  const dbUser = await DI.userRepository.findOne({ email });

  if (!dbUser) {
    // User not found
    return context.throw(401, "Wrong user or password");
  }

  // Check if user provided password matches db password
  const correctPassword = await bcrypt.compare(
    dbUser.hashedPassword,
    userProvidedPassword
  );

  if (!correctPassword) {
    // Password did not match
    return context.throw(401, "Wrong user or password");
  }

  // Create jwt token
  const token = jwt.sign({ email }, secret, { expiresIn: "7 days" });

  context.body = { token };
});

userController.post("/register", async function (context) {
  const { email, password: userProvidedPassword } = context.body;

  const hashedPassword = await bcrypt.hash(userProvidedPassword, saltRounds);

  // Create and save user to db
  const user = DI.userRepository.create({ email, hashedPassword });
  await DI.userRepository.persistAndFlush(user);

  // Create jwt token
  const token = jwt.sign({ email: user.email }, secret, {
    expiresIn: "7 days",
  });

  context.body = { email: user.email, token };
});

export { userController };
