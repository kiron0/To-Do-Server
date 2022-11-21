const router = require("express").Router();
const VerifyAdmin = require("../../middlewares/VerifyAdmin");
const VerifyToken = require("../../middlewares/VerifyToken");

const {
  getAppName,
  updateAppName,
} = require("../../controllers/appController");

router.get("/app/appName", getAppName);
router.patch("/app/changeAppName", VerifyToken, VerifyAdmin, updateAppName);

module.exports = router;
