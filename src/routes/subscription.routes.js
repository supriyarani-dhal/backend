import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router
  .route("/c/:channelId")
  .post(toggleSubscription)
  .get(getSubscribedChannels);
router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router;
