const router = require("express").Router();
const VerifyAdmin = require("../../middlewares/VerifyAdmin");
const VerifyToken = require("../../middlewares/VerifyToken");
const {
  getUsers,
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
  findAdmin,
  makeAdmin,
  removeAdmin,
} = require("../../controllers/usersController");

router.get("/users", getUsers);
router.get("/users/all", VerifyToken, VerifyAdmin, getAllUsers);
router.get("/admin/:email", findAdmin);
router.put("/user", createUser);
router.patch("/users", VerifyToken, updateUser);
router.delete("/user/:email", VerifyToken, VerifyAdmin, deleteUser);
router.put("/user/admin", VerifyToken, VerifyAdmin, makeAdmin);
router.put("/user/removeAdmin", VerifyToken, VerifyAdmin, removeAdmin);

module.exports = router;
