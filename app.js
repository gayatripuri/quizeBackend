const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config();
const quizRoutes = require('./Routes/user');
const authRouter = require("./Routes/authRoute");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors({
  origin: '*',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send('Api is Working');
});
app.use("/api/auth", authRouter);

app.use('/quiz', quizRoutes);
module.exports = app;
