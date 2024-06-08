import { response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { createConnection } from "mongoose";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateSaccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  //get user details
  const { username, email } = req.body;

  //validate
  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  //password check
  const isPasswordvalidate = await user.isPasswordCorrect(password);
  if (!isPasswordvalidate) {
    throw new ApiError(401, "Invalid login credential");
  }

  //generate access token and refresh token
  const { accessToken, refreshToken } =
    await generateSaccessTokenAndRefreshToken(user._id);
  const loggenInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send cookies
  const options = {
    //the cookie can't modifieble by frontend
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggenInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("AccessToken", accessToken, options)
    .clearCookie("RefreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "User loggedout"));
});

export { registerUser, loginUser, logoutUser };
