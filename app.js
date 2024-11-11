const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { apiMiddleware } = require("./utils/logger.util");

const dotenv = require("dotenv");
dotenv.config();

const config = require("./utils/config.util");
config.init();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(apiMiddleware);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/", require("./routes/main.route"));

module.exports = app;
