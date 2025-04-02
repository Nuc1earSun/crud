"use server";

function isAlphaNumeric(x) {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(x);
}

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
    }
  }

  // storing user in db
  // log them in using cookie

  return {
    success: true,
  }
};
