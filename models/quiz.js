
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
 userId :{
  type:mongoose.Schema.Types.ObjectId,
  required: true,
 },
 impressions:{
type: Number,
default: 0,
 },
 title: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    required: true,
  },
  timer: {
    type: Number,
    default: -1,
  },
  questions: [
    {
      question: { type: String },
      optionType: {
        type: String,
      },
      options: [
        {
          text: { type: String },
          imgUrl: { type: String },
        },
      ],
      correctOptionIndex: {type:Number},
    },
  ],
  shareableLink:{
    type:String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  }
});

const quiz = new mongoose.model("Quiz", quizSchema);

module.exports = quiz;
