import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import client from "../utils/dbCollection";
const usersCollection = client.db("kTaskToDo").collection("users" as string);

export const getUsers = async (req: Request, res: Response) => {
  const uid = req.query.uid;
  if (uid) {
    const users = await usersCollection.find({ uid: uid }).toArray();
    res.send(users);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const uid = req.query.uid;
  const id = req.params.id;
  if (uid) {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    res.send(user);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  let { page, limit } = req.query as any;
  page = parseInt(page);
  limit = parseInt(limit);
  if (!page) page = 1;
  if (!limit) limit = 10;
  const skip = (page - 1) * limit;
  const users = await usersCollection.find({}).skip(skip).limit(limit).toArray();
  const pages = Math.ceil((await usersCollection.countDocuments({})) / limit);
  const totalUsers = await usersCollection.countDocuments({});
  res.send({ success: true, pages: pages, users: users, totalUsers: totalUsers });
};

export const updateUser = async (req: Request, res: Response) => {
  const data = req.body;
  const uid = req.query.uid as string;
  const decodedID = req?.body?.user?.uid;
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

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  const filter = { email: user.email, uid: user.uid };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign(
    { email: user.email, uid: user.uid },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15d" }
  );
  res.send({ result, token });
};

export const deleteUser = async (req: Request, res: Response) => {
  const email = req.params.email;
  const result = await usersCollection.deleteOne({ email: email });
  res.send(result);
};

export const findAdmin = async (req: Request, res: Response) => {
  const email = req.params.email;
  const user = await usersCollection.findOne({ email: email });
  const isAdmin = user?.role === "admin";
  res.send({ admin: isAdmin });
};

export const makeAdmin = async (req: Request, res: Response) => {
  const email = req.body.email;
  const filter = { email: email };
  const updateDoc = {
    $set: { role: "admin" },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
};

export const removeAdmin = async (req: Request, res: Response) => {
  const email = req.body.email;
  const filter = { email: email };
  const updateDoc = {
    $unset: { role: "" },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
};

// get only gmail users
export const getGmailUsers = async (req: Request, res: Response) => {
  const users = await usersCollection.find({ email: { $regex: /@/ } }).toArray();
  if (users.length > 0) {
    res.send({ success: true, message: "Get gmail users successfully", result: users });
  } else {
    res.send({ success: false, message: "No gmail users found" });
  }
};