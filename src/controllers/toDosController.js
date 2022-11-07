const dbConnect = require("../utils/dbConnect");
const { ObjectId } = require("mongodb");
const toDosCollection = dbConnect.db("kTaskToDo").collection("tasks");

const getAllToDos = async (req, res) => {
  const toDos = await toDosCollection.find({}).toArray();
  res.send(toDos);
};

const createToDo = async (req, res) => {
  const data = req.body;
  const decodedId = req.decoded.uid;
  const uid = req.query.uid;
  if (uid === decodedId) {
    const result = await toDosCollection.insertOne(data);
    if (result.acknowledged) {
      res.send({
        success: true,
        message: "ToDos Added successfully",
      });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

const deleteToDo = async (req, res) => {
  const todoId = req.query.todoId;
  const decodedId = req.decoded.uid;
  const uid = req.query.uid;
  if (decodedId === uid) {
    const result = await toDosCollection.deleteOne({
      _id: ObjectId(todoId),
    });
    if (result.acknowledged) {
      res.send({
        success: true,
        message: "ToDo Deleted successfully",
      });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

const deleteToDoAdmin = async (req, res) => {
  const todoId = req.params.id;
  const result = await toDosCollection.deleteOne({
    _id: ObjectId(todoId),
  });
  if (result.acknowledged) {
    res.send({
      success: true,
      message: "ToDo Deleted successfully",
    });
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

const completeToDo = async (req, res) => {
  const decodedId = req.decoded.uid;
  const uid = req.query.uid;
  const todoId = req.query.todoId;
  if (decodedId === uid) {
    const query = { _id: ObjectId(todoId) };
    const updateDoc = {
      $set: { completed: true },
    };
    const result = await toDosCollection.updateOne(query, updateDoc);
    if (result.acknowledged) {
      res.send({ success: true, message: "ToDo is Completed" });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

const getMyToDos = async (req, res) => {
  const decodedEmail = req.decoded.email;
  const email = req.query.email;
  if (email === decodedEmail) {
    const myItems = await toDosCollection.find({ email: email }).toArray();
    res.send(myItems);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

const getMyCompletedToDos = async (req, res) => {
  const decodedEmail = req.decoded.email;
  const email = req.query.email;
  if (email === decodedEmail) {
    const myItems = await toDosCollection
      .find({ email: email, completed: true })
      .toArray();
    res.send(myItems);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

const updateToDo = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updatedDoc = {
    $set: body,
  };
  const toDoUpdated = await toDosCollection.updateOne(
    filter,
    updatedDoc,
    options
  );
  res.send(toDoUpdated);
};

module.exports = {
  getAllToDos,
  createToDo,
  deleteToDo,
  deleteToDoAdmin,
  completeToDo,
  getMyToDos,
  getMyCompletedToDos,
  updateToDo,
};
