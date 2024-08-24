import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/").post(createTweet);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
router.route("/user/:userId").get(getUserTweets);

export default router;
