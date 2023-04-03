import { Router } from "express";
const router: Router = Router();
import {
  getAllToDos,
  createToDo,
  deleteToDo,
  completeToDo,
  getMyToDos,
  getMyToDosByTitle,
  getMyCompletedToDos,
  updateToDo,
  filteredToDos,
  getToDoSbyEmail,
} from "../../controllers/toDos.controller";
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";
import { VerifyToken } from "../../middlewares/VerifyToken";

router.get("/toDos", VerifyToken, VerifyAdmin, getAllToDos);
router.post("/createToDo", VerifyToken, createToDo);
router.delete("/toDoS", VerifyToken, deleteToDo);
router.patch("/toDoS", VerifyToken, completeToDo);
router.get("/myToDos", VerifyToken, getMyToDos);
router.get("/myToDos/filtered", VerifyToken, filteredToDos);
router.get("/myToDos/email", VerifyToken, VerifyAdmin, getToDoSbyEmail);
router.get("/myToDoS/search", VerifyToken, getMyToDosByTitle);
router.get("/myToDoS/completed", VerifyToken, getMyCompletedToDos);
router.patch("/toDos/updateToDoS", VerifyToken, updateToDo);

export default router;
