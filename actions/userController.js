"use server";

import { cookies } from "next/headers";
import { getCollection } from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

function isAlphaNumeric(x) {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(x);
}

export const logout = async function () {
  (await cookies()).delete("crud");
  redirect("/");
};

export const register = async function (prevState, formData) {
  const errors = {};

  const user = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  if (typeof user.username !== "string") {
    user.username = "";
  }
  user.username = user.username.trim();

  if (typeof user.password !== "string") {
    user.password = "";
  }
  user.password = user.password.trim();

  if (user.username.length < 4) {
    errors.username = "Username must be at least 3 characters long";
  }
  if (user.username.length > 30) {
    errors.username = "Username cannot be longer than 30 characters";
  }
  if (!isAlphaNumeric(user.username)) {
    errors.username = "Username can only contain letters and numbers";
  }

  if (user.password.length <= 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (user.password.length > 12) {
    errors.password = "Password cannot be longer than 12 characters";
  }
  if (!isAlphaNumeric(user.password)) {
    errors.password = "Password can only contain letters and numbers";
  }

  if (errors.username || errors.password) {
    return {
      errors,
      success: false,
    };
  }

  // hash password

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);

  // storing user in db

  const usersCollection = await getCollection("users");
  const newUser = await usersCollection.insertOne(user);
  const userId = newUser.insertedId.toString();
  // create jwt token
  const token = jwt.sign(
    {
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    process.env.JWT_SECRET
  );

  // log them in using cookie
  cookies().set("crud", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    secure: true,
  });

  return {
    success: true,
  };
};
