import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//some middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes section

//route import
import userRouter from "./routes/user.routes.js";

//route declaration (app.get() contains both the controller and routes but app.use() contains controllers separately trough middlewares)
app.use("/api/v1/user", userRouter);

export default app;
