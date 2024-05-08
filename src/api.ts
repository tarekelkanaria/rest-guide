import express from "express";

import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import crypto from "crypto";
import helmet from "helmet";
import serverless from "serverless-http";
import compression from "compression";
import multer, { type FileFilterCallback } from "multer";
import feedRoutes from "./routes/feed";
import authRoutes from "./routes/auth";
import { MONGODB_URI, PORT } from "./utils/secrets";
import type { NextFunction, Request, Response } from "express";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (_req, file, cb) => {
    crypto.randomBytes(12, (err, buf) => {
      if (err) throw new Error("can't upload file");
      else {
        cb(null, buf.toString("hex") + "-" + file.originalname);
      }
    });
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(helmet());
app.use(compression());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/images", express.static(path.join(__dirname, "..", "images")));

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({ start: "Home Page" });
});

app.use(
  (
    error: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
  }
);

try {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT || 3000);
} catch (err) {
  console.log(err);
}

// mongoose
//   .connect(MONGODB_URI)
//   .then(() => app.listen(PORT || 3000))
//   .catch((err) => console.log(err));

export const handler = serverless(app);
