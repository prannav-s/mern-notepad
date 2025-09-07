import express from "express";
import dotenv from "dotenv";
import cors from "cors"

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./ratelimiter/rateLimiter.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json()); //middleware that will parse JSON bodies: req.body
app.use(rateLimiter);

//custom middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next();
})

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
        app.listen(PORT, () => {
            console.log("Server started on PORT:", PORT);
    });
});
