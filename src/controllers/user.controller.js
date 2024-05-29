import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (res) => {
  res.status(200).json({
    message: "OK",
  });
});

export default registerUser;
