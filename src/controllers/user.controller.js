import { response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { createConnection } from "mongoose";
import ApiError from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  // steps for logic building
  // 1.get user details from frontend
  // 2.validate - not empty
  // 3.check trhe user exist - Email, username
  // 4. check for emages and avatar
  // 5. upload them to cloudinary
  // 6.create user object - create them an entry in db
  // 7. remove password and refresh token field from response
  // 8. check for user creation
  // 9. return res

  const { username, password, email, fullname } = req.body;

  if (
    [username, password, email, fullname].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, `${field} is required`);
  }
});

export default registerUser;
