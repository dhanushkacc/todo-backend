const express = require("express");
const router = express.Router();
const { verifySignin } = require("../middlewares/Auth");
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  checksum,
} = require("../controllers/TaskController");

router.get("/", verifySignin, getTasks);
router.post("/add", verifySignin, addTask);
router.put("/update/:taskId", verifySignin, updateTask);
router.delete("/delete", verifySignin, deleteTask);
router.put("/complete/:taskId", verifySignin, checksum);

module.exports = router;
