import { Request, Response, NextFunction } from "express";
import client from "../utils/dbCollection";
export const usersCollection = client.db("kTaskToDo").collection("users");

export const VerifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const requester = req?.body?.user?.email;
  const requesterAccount = await usersCollection.findOne({
    email: requester,
  }) as any;
  if (requesterAccount.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "forbidden" });
  }
};
