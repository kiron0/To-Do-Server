import { Request, Response } from "express";
import client from "../utils/dbCollection";
import { ObjectId } from "mongodb";
const toDosCollection = client.db("kTaskToDo").collection("tasks");

export const getAllToDos = async (req: Request, res: Response) => {
  const toDos = await toDosCollection.find({}).toArray();
  res.send({ success: true, message: "All ToDos", result: toDos });
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
  let { email, page, limit } = req.query as any;
  page = parseInt(page);
  limit = parseInt(limit);
  if (!page) page = 1;
  if (!limit) limit = 10;
  const skip = (page - 1) * limit;
  if (email === decodedEmail) {
    const myItems = await toDosCollection.find({ email: email }).sort({ _id: -1 }).skip(skip).limit(limit).toArray();
    const pages = Math.ceil((await toDosCollection.countDocuments({ email: email })) / limit);
    res.send({ success: true, pages: pages, toDos: myItems });
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getToDoSbyEmail = async (req: Request, res: Response) => {
  const email = req.query.email;
  if (email) {
    const myItems = await toDosCollection.find({ email: email }).toArray();
    res.send({ success: true, message: `ToDoS Found for ${email}`, result: myItems });
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getMyToDosByTitle = async (req: Request, res: Response) => {
  const email = req.query.email;
  const title = req.query.title;
  const result = await toDosCollection.find({}).toArray();
  const searchedResult = result.filter(
    (item) =>
      item.email === email &&
      item.title.toLowerCase() === (title as string).toLowerCase()
  );
  // get the first part from the title without slice
  if (searchedResult.length > 0) {
    res.status(200).send({ success: true, message: "Searched Result Found", result: searchedResult[0] });
  } else {
    res.status(200).send({ success: false, message: "No result found" })
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
  const todoId = req.query.todoId;
  const decodedId = req?.body?.user?.uid;
  const uid = req.query.uid;
  if (decodedId === uid) {
    const body = req.body;
    const filter = { _id: new ObjectId(todoId as string), };
    const options = { upsert: true };
    const updatedDoc = {
      $set: body,
    };
    const toDoUpdated = await toDosCollection.updateOne(
      filter,
      updatedDoc,
      options
    );
    res.send({ success: true, message: "ToDo Updated Successfully", result: toDoUpdated });
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

export const filteredToDos = async (req: Request, res: Response) => {
  const email = req.query.email;
  const filter = req.query.filter;
  const myItems = await toDosCollection.find({ email: email }).toArray();
  if (filter === "completed") {
    const filteredToDos = myItems.filter((item) => item.completed === true);
    res.send({
      success: true,
      message: "All ToDos",
      result: filteredToDos,
    });
  } else if (filter === "pending") {
    const filteredToDos = myItems.filter((item) => item.completed === false || item.completed === undefined);
    res.send({
      success: true,
      message: "All ToDos",
      result: filteredToDos,
    });
  } else if (filter === "all") {
    res.send({
      success: true,
      message: "All ToDos",
      result: myItems,
    });
  } else {
    res.send({
      success: true,
      message: "All ToDos",
      result: myItems,
    });
  }
}