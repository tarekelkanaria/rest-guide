"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const multer_1 = __importDefault(require("multer"));
const feed_1 = __importDefault(require("./routes/feed"));
const auth_1 = __importDefault(require("./routes/auth"));
const secrets_1 = require("./utils/secrets");
const app = (0, express_1.default)();
const fileStorage = multer_1.default.diskStorage({
    destination: (_req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (_req, file, cb) => {
        crypto_1.default.randomBytes(12, (err, buf) => {
            if (err)
                throw new Error("can't upload file");
            else {
                cb(null, buf.toString("hex") + "-" + file.originalname);
            }
        });
    },
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "..", "images")));
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter }).single("image"));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/feed", feed_1.default);
app.use("/auth", auth_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
});
mongoose_1.default
    .connect(secrets_1.MONGODB_URI)
    .then(() => app.listen(secrets_1.PORT || 8080))
    .catch((err) => console.log(err));
