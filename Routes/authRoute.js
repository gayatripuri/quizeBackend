const express = require("express");
const { login, register, logout } = require("../Controllers/authentication");
const isAuthenticated = require("../middlewares/auth");

const authRouter = express.Router();
authRouter.post("/register", register).post("/login", login);
// Logout route
authRouter.post("/logout", isAuthenticated, logout);
module.exports = authRouter;
