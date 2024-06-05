import { response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { createConnection } from "mongoose";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // steps for logic building

  // 1.get user details from frontend
  const { username, password, email, fullname } = req.body;

  // 2.validate - not empty
  if (
    [username, password, email, fullname].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, `${field} is required`);
  }

  // 3.check trhe user exist - Email, username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username is already exists");
  }

  // 4. check for emages and avatar
  //console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalpath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 5. upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);
  //console.log(avatar);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 6.create user object - create them an entry in db
  const user = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // 7. remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  // 8. check for user creation
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering , please wait a while"
    );
  }

  // 9. return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export default registerUser;
