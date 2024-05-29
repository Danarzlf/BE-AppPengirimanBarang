require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.routes");
const userProfileRoute = require("./routes/userProfile.routes");

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/api/v1/users", userRoute);
app.use("/api/v1/user-profiles", userProfileRoute);


app.get("/", (req, res) => {
    res.send("Welcome to server");
  });
  

// 404 error handling
app.use((req, res, next) => {
    res.status(404).json({
      status: false,
      message: "Bad Request",
      data: null,
    });
  });
  
  // 500 error handling
  app.use((err, req, res, next) => {
    res.status(500).json({
      status: false,
      message: err.message ?? "Internal Server Error",
      data: null,
    });
  });
  

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Database is connected successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
