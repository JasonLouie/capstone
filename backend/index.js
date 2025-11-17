import express from "express";
import "dotenv/config";
import connectDB from "./db/conn.js";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
    res.json({message: "Hello world!"});
});

app.listen(port, () => {
    console.log("Listening on port:", port);
    connectDB();
});