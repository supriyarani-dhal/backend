import { Router } from "express";
import { verifrJwt } from "../middlewares/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";

const router = Router();

//verifyJst is applied to all routes in this file
router.use(verifrJwt);

router.route("/status").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router;
