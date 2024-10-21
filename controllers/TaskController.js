const Task = require("../models/TaskModel");


const getTasks = async (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const addTask = async (req, res) => {
  const userId = req.user.id;
  const { title, description, dueDate, dueTime } = req.body;

  try {
    const newTask = new Task({
      userId,
      title,
      description,
      dueDate,
      dueTime,
      isCompleted: false,
      highlightToday: false,
    });

    const savedTask = await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: savedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const updateFields = req.body;

  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteTask = async (req, res) => {
  const { taskId } = req.body;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const checksum = async (req, res) => {
  const taskId = req.params.taskId;
  const { isCompleted } = req.body;

  if (typeof isCompleted !== "boolean") {
    return res.status(400).json({ message: "isCompleted must be a boolean value" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isCompleted },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task completion status updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  checksum,
};
