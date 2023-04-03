import { Router } from "express";
const router: Router = Router();
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";
import { VerifyToken } from "../../middlewares/VerifyToken";
import {
          getUsers,
          getUserById,
          getAllUsers,
          updateUser,
          createUser,
          deleteUser,
          findAdmin,
          makeAdmin,
          removeAdmin,
          getGmailUsers,
} from "../../controllers/users.controller";

// here will be all the routes
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.get("/users/all", VerifyToken, VerifyAdmin, getAllUsers);
router.get("/admin/:email", findAdmin);
router.get("/gmailUsers", getGmailUsers);
router.put("/user", createUser);
router.patch("/users", VerifyToken, updateUser);
router.delete("/user/:email", VerifyToken, VerifyAdmin, deleteUser);
router.put("/user/admin", VerifyToken, VerifyAdmin, makeAdmin);
router.put("/user/removeAdmin", VerifyToken, VerifyAdmin, removeAdmin);

export default router;
