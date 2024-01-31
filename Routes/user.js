const express = require("express");
const quiz = require("../Controllers/quiz");
const authenticateUser = require("../middlewares/auth");

const router = express.Router();

// Apply authenticateUser middleware to routes that require authentication
// router.use(authenticateUser);
// Create a new quiz
router.post("/create", authenticateUser, quiz.createQuiz);

// Add questions to an existing quiz
router.post("/addQuestionsToQuiz", quiz.addQuestionsToQuiz); // New route

router.get("/analytics-data", authenticateUser, quiz.getAlldata);
// Retrieve a quiz by ID
router.get("/:quizId", quiz.getQuizById);

router.delete("/api/deleteQuiz/:quizId", quiz.deleteQuiz);
router.put("/api/editQuiz/:quizId", quiz.editQuiz);
router.get("/shared/:shareableLink", quiz.getSharedQuiz);

module.exports = router;
