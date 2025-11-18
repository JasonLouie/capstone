import "dotenv/config";
import express from "express";
import passport from "passport";
import "./config/passport.js";
import connectDB from "./db/conn.js";
import userRouter from "./routes/userRouter.js";
import logRequest from "./middleware/requestLogger.js";
import handleServerErrors from "./middleware/errorHandler.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());

app.use(logRequest);

app.get("/", (req, res) => {
    res.json({message: "Server is up and running!"});
});

app.use("/api/users", userRouter);

app.use(handleServerErrors);

app.listen(port, () => {
    console.log("Listening on port:", port);
    connectDB();
});