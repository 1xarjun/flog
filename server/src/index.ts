import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import API from "./routes/api";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import "./config/passport.config";
import cors from "cors";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI!
      : process.env.MONGO_LOCAL_URI!,
  )
  .then(() => console.log("MongoDB successfully connected!"))
  .catch((err) => console.error("MongoDB connection error: ", err));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: false })); // parse form data

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET!,
    resave: false, // dont save to store again if nothing changed
    saveUninitialized: false, // dont store until something is added
    store: MongoStore.create({
      mongoUrl:
        process.env.NODE_ENV === "production"
          ? process.env.MONGO_URI!
          : process.env.MONGO_LOCAL_URI!,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true, // server only
    },
  }),
);

// passport setup
app.use(passport.initialize());
app.use(passport.session()); // get user from session on each request

// logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", API);

interface E extends Error {
  status?: string;
  statusCode?: number;
}

app.use((err: E, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
