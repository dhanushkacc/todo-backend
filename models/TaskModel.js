const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  dueTime: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  highlightToday: {
    type: Boolean,
    default: false,
  },
});

const TaskModel = mongoose.model("Task", TaskSchema);
module.exports = TaskModel;
