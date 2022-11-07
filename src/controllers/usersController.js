const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const dbConnect = require("../utils/dbConnect");
const usersCollection = dbConnect.db("kTaskToDo").collection("users");

const getUsers = async (req, res) => {
  const uid = req.query.uid;
  if (uid) {
    const users = await usersCollection.find({ uid: uid }).toArray();
    res.send(users);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

const getUserById = async (req, res) => {
  const uid = req.query.uid;
  const id = req.params.id;
  if (uid) {
    const user = await usersCollection.findOne({ _id: ObjectId(id) });
    res.send(user);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

const getAllUsers = async (req, res) => {
  const users = await usersCollection.find({}).toArray();
  res.send(users);
};

// update user data using patch
const updateUser = async (req, res) => {
  const data = req.body;
  const uid = req.query.uid;
  const decodedID = req.decoded.uid;
  const query = { uid: uid };
  const updateDoc = {
    $set: data,
  };
  if (decodedID === uid) {
    const result = await usersCollection.updateOne(query, updateDoc);
    if (result.acknowledged) {
      res.send({ success: true, message: "Update profile successfully" });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden request" });
  }
};

const createUser = async (req, res) => {
  const user = req.body;
  const filter = { email: user.email, uid: user.uid };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign(
    { email: user.email, uid: user.uid },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.send({ result, token });
};

const deleteUser = async (req, res) => {
  const email = req.params.email;
  const result = await usersCollection.deleteOne({ email: email });
  res.send(result);
};

const findAdmin = async (req, res) => {
  const email = req.params.email;
  const user = await usersCollection.findOne({ email: email });
  const isAdmin = user?.role === "admin";
  res.send({ admin: isAdmin });
};

const makeAdmin = async (req, res) => {
  const email = req.body.email;
  const filter = { email: email };
  const updateDoc = {
    $set: { role: "admin" },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
};

const removeAdmin = async (req, res) => {
  const email = req.body.email;
  const filter = { email: email };
  const updateDoc = {
    $set: { role: "" },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
};

module.exports = {
  getUsers,
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
  findAdmin,
  makeAdmin,
  removeAdmin,
};
