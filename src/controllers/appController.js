const { ObjectId } = require("mongodb");
const client = require("../utils/dbConnect");
const appNameCollection = client.db("kTaskToDo").collection("appName");

const getAppName = async (req, res) => {
  const appID = {
    _id: ObjectId("637be03206a8ad9fabc39e44"),
  };
  const appName = await appNameCollection.findOne(appID);
  res.send(appName);
};

const updateAppName = async (req, res) => {
  const name = req.body;
  const appID = {
    _id: ObjectId("637be03206a8ad9fabc39e44"),
  };
  const updateDoc = {
    $set: name,
  };
  const result = await appNameCollection.updateOne(appID, updateDoc);
  if (result.acknowledged) {
    res.send({ success: true, message: "Update app name successfully" });
  }
};

module.exports = { getAppName, updateAppName };
