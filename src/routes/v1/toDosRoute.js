const router = require("express").Router();
const {
  getAllToDos,
  createToDo,
  deleteToDo,
  deleteToDoAdmin,
  completeToDo,
  getMyToDos,
  getMyCompletedToDos,
  updateToDo,
} = require("../../controllers/toDosController");
const VerifyAdmin = require("../../middlewares/VerifyAdmin");
const VerifyToken = require("../../middlewares/VerifyToken");

router.get("/toDos", getAllToDos);
router.post("/createToDo", VerifyToken, createToDo);
router.delete("/toDoS", VerifyToken, deleteToDo);
router.delete("/todoS/:id", VerifyToken, VerifyAdmin, deleteToDoAdmin);
router.patch("/toDoS", VerifyToken, completeToDo);
router.get("/myToDos", VerifyToken, getMyToDos);
router.get("/myToDoS/completed", VerifyToken, getMyCompletedToDos);
router.patch("/toDos/updateToDoS/:id", VerifyToken, updateToDo);

module.exports = router;
