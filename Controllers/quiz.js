const Quiz = require("../models/quiz");
const shortid = require("shortid");

// Function to create a quiz with name and type
const createQuiz = async (req, res) => {
  try {
    console.log("userid here", req.userId);
    const { title, quizType } = req.body;
    console.log("req.body:", title, quizType);
    // Additional validation checks can be added here

    // Create a new quiz
    const newQuiz = await Quiz.create({
      userId: req.userId,
      title,
      quizType,
    });

    // Send the created quiz ID as a response
    res.status(201).json({ quizId: newQuiz._id });
  } catch (error) {
    console.error(error);

    // Handle specific errors
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ error: "Validation error. Please check your input." });
    } else {
      // Generic error handling
      console.error("Error during quiz creation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

function generateShortLink() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6;
  let shortLink = "";
  for (let i = 0; i < length; i++) {
    shortLink += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return shortLink;
}

// Function to add questions, options, timer, etc., to an existing quiz
const addQuestionsToQuiz = async (req, res) => {
  try {
    console.log(req.body);

    const { quizId, questions, timer } = req.body;

    const existingQuiz = await Quiz.findById(quizId);

    console.log(existingQuiz);

    if (!existingQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const getOptions = (optionType, optionList, imgUrls) => {
      if (optionType === "text") {
        return optionList.map((option) => {
          return {
            text: option,
          };
        });
      } else if (optionType === "imgurl") {
        return optionList.map((option) => {
          return {
            imgUrl: option,
          };
        });
      } else if (optionType === "text_with_imgurl") {
        return optionList.map((option, index) => {
          return {
            text: option,
            imgUrl: imgUrls[index],
          };
        });
      }
    };
    // Add questions, options, timer, etc., to the existing quiz
    // Modify the code to handle options in each question
    const shortLink = generateShortLink();
    existingQuiz.shareableLink = shortLink;
    existingQuiz.timer = timer;
    existingQuiz.questions = questions.map((question) => ({
      question: question.pollQuestion,
      optionType: question.optionType,
      options: getOptions(
        question.optionType,
        question.optionsList,
        question.imgUrls
      ),
      correctOptionIndex: question.correctOptionIndex,
    }));

    // Save the updated quiz
    const updatedQuiz = await existingQuiz.save();

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSharedQuiz = async (req, res) => {
  try {
    const { shareableLink } = req.params;
    console.log(shareableLink, "1");
    // Find the quiz based on the shareable link
    const sharedQuiz = await Quiz.findOne({ shareableLink });
    console.log(sharedQuiz, "2");
    if (!sharedQuiz) {
      return res.status(404).json({ error: "Shared quiz not found" });
    }
    sharedQuiz.impressions = sharedQuiz.impressions + 1;
    await sharedQuiz.save();
    // Return the shared quiz details
    res.status(200).json(sharedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Quiz not found" });
  }
};

const getAlldata = async (req, res) => {
  const userId = req.userId;
  try {
    console.log("Fetching all data...", userId);
    const data = await Quiz.find({ userId });
    console.log("Fetched data:", data);
    if (!data) {
      console.log("No data found");
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz retrieved successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully", deletedQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { questions } = req.body;

    // Input validation for edit can be added here

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { questions },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createQuiz,
  addQuestionsToQuiz,
  getSharedQuiz,
  getQuizById,
  deleteQuiz,
  editQuiz,
  getAlldata,
};
