import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import "./config/passport.js";
import connectDB from "./db/conn.js";
import { protect } from "./middleware/userAuth.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import gameRouter from "./routes/gameRouter.js";
import logRequest from "./middleware/requestLogger.js";
import handleServerErrors from "./middleware/errorHandler.js";

const app = express();
const port = 8080;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());

app.use(logRequest);

app.get("/", (req, res) => {
    res.json({message: "Server is up and running!"});
});

app.use("/api/auth", authRouter);

app.use("/api/users", protect, userRouter);

app.use("/api/games", protect, gameRouter);

app.use(handleServerErrors);

app.listen(port, () => {
    console.log("Listening on port:", port);
    connectDB();
});