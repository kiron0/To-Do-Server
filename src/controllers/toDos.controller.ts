import { Request, Response } from "express";
import client from "../utils/dbCollection";
import { ObjectId } from "mongodb";
const toDosCollection = client.db("kTaskToDo").collection("tasks");

export const getAllToDos = async (req: Request, res: Response) => {
  const toDos = await toDosCollection.find({}).toArray();
  res.send(toDos);
};

export const createToDo = async (req: Request, res: Response) => {
  const data = req.body;
  const decodedId = req?.body?.user?.uid;
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

export const deleteToDo = async (req: Request, res: Response) => {
  const todoId = req.query.todoId;
  const decodedId = req?.body?.user?.uid;
  const uid = req.query.uid;
  if (decodedId === uid) {
    const result = await toDosCollection.deleteOne({
      _id: new ObjectId(todoId as string),
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

export const deleteToDoAdmin = async (req: Request, res: Response) => {
  const todoId = req.params.id;
  const result = await toDosCollection.deleteOne({
    _id: new ObjectId(todoId as string),
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

export const completeToDo = async (req: Request, res: Response) => {
  const decodedId = req?.body?.user?.uid;
  const uid = req.query.uid;
  const todoId = req.query.todoId;
  if (decodedId === uid) {
    const query = { _id: new ObjectId(todoId as string), };
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

export const getMyToDos = async (req: Request, res: Response) => {
  const decodedEmail = req?.body?.user?.email;
  const email = req.query.email;
  if (email === decodedEmail) {
    const myItems = await toDosCollection.find({ email: email }).toArray();
    res.send(myItems);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getMyCompletedToDos = async (req: Request, res: Response) => {
  const decodedEmail = req?.body?.user?.email;
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

export const updateToDo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const filter = { _id: new ObjectId(id as string), };
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
