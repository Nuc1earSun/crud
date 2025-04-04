"use server";

import { redirect } from "next/navigation";
import { getUserFromCookie } from "../lib/getUser";
import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db";

async function isAlphaNumericWithSpace(str) {
  const regex = /^[a-zA-Z0-9 .,]*$/;
  return regex.test(str);
}

async function sharedHaikuLogic(formData, user) {
  const errors = {};

  const haiku = {
    line1: formData.get("line1"),
    line2: formData.get("line2"),
    line3: formData.get("line3"),
    author: ObjectId.createFromHexString(user.userId),
  };

  if (typeof haiku.line1 !== "string") {
    haiku.line1 = "";
  }

  if (typeof haiku.line2 !== "string") {
    haiku.line2 = "";
  }

  if (typeof haiku.line3 !== "string") {
    haiku.line3 = "";
  }

  //no line breaks
  haiku.line1 = haiku.line1.replace(/(\r\n|\n|\r)/g, " ");
  haiku.line2 = haiku.line2.replace(/(\r\n|\n|\r)/g, " ");
  haiku.line3 = haiku.line3.replace(/(\r\n|\n|\r)/g, " ");

  haiku.line1 = haiku.line1.trim();
  haiku.line2 = haiku.line2.trim();
  haiku.line3 = haiku.line3.trim();

  if (haiku.line1.length < 5) {
    errors.line1 = "Line 1 must be at least 5 characters long";
  }
  if (haiku.line2.length < 5) {
    errors.line2 = "Line 2 must be at least 5 characters long";
  }
  if (haiku.line3.length < 5) {
    errors.line3 = "Line 3 must be at least 5 characters long";
  }

  if (haiku.line1.length > 25) {
    errors.line1 = "Line 1 cannot be longer than 25 characters";
  }
  if (haiku.line2.length > 25) {
    errors.line2 = "Line 2 cannot be longer than 25 characters";
  }
  if (haiku.line3.length > 25) {
    errors.line3 = "Line 3 cannot be longer than 25 characters";
  }

  if (!isAlphaNumericWithSpace(haiku.line1)) {
    errors.line1 = "Line 1 can only contain letters, numbers, and spaces";
  }
  if (!isAlphaNumericWithSpace(haiku.line2)) {
    errors.line1 = "Line 2 can only contain letters, numbers, and spaces";
  }
  if (!isAlphaNumericWithSpace(haiku.line3)) {
    errors.line1 = "Line 3 can only contain letters, numbers, and spaces";
  }

  if (haiku.line1.length === 0) {
    errors.line1 = "Line 1 cannot be empty";
  }
  if (haiku.line2.length === 0) {
    errors.line2 = "Line 2 cannot be empty";
  }
  if (haiku.line3.length === 0) {
    errors.line3 = "Line 3 cannot be empty";
  }

  return {
    errors,
    haiku,
  };
}

export const createHaiku = async function (prevState, formData) {
  const user = await getUserFromCookie();
  if (!user) {
    return redirect("/");
  }
  const results = await sharedHaikuLogic(formData, user);

  if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
    return {
      errors: results.errors,
    };
  }

  //save into mongodb
  const haikusCollection = await getCollection("haikus");
  const newHaiku = await haikusCollection.insertOne(results.haiku);

  return redirect("/");
};
export const editHaiku = async function (prevState, formData) {
  const user = await getUserFromCookie();
  if (!user) {
    return redirect("/");
  }
  const results = await sharedHaikuLogic(formData, user);

  if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
    return {
      errors: results.errors,
    };
  }

  //save into mongodb
  const haikusCollection = await getCollection("haikus");

  let haikuId = formData.get("haikuId");
  if (typeof haikuId !== "string") {
    haikuId = "";
  }

  const haikuInQuestion = await haikusCollection.findOne({
    _id: ObjectId.createFromHexString(haikuId),
  });
  if (haikuInQuestion.author.toString() !== user.userId) {
    return redirect("/");
  }

  await haikusCollection.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(haikuId) },
    { $set: results.haiku }
  );

  return redirect("/");
};

export const deleteHaiku = async function (formData) {
  const user = await getUserFromCookie();
  if (!user) {
    return redirect("/");
  }
  const haikusCollection = await getCollection("haikus");

  let haikuId = formData.get("id");
  if (typeof haikuId !== "string") {
    haikuId = "";
  }
  const haikuInQuestion = await haikusCollection.findOne({
    _id: ObjectId.createFromHexString(haikuId),
  });
  if (haikuInQuestion.author.toString() !== user.userId) {
    return redirect("/");
  }

  await haikusCollection.deleteOne({
    _id: ObjectId.createFromHexString(haikuId),
  });

  return redirect("/");
};
