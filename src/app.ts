import path from 'path';
import cors from "cors";
import "dotenv/config";
import express, { Application, Request, Response } from "express";

const app: Application = express();

/* middleware  */
app.use(cors());
app.use(express.json());

/* here will be all the imports routes */
import { default as userRouter } from "./routes/v1/users.route";
import { default as toDosRouter } from "./routes/v1/toDos.route";
import { default as appRouter } from "./routes/v1/app.route";

/* here will be the all the routes */
app.get("/", (req: Request, res: Response) => {
          res.sendFile(path.join(__dirname, "../views/index.html"));
});

/* Here is the User Routes */
app.use("/api/v1", userRouter);
app.use("/api/v1/", toDosRouter);
app.use("/api/v1/", appRouter);

// 404 response
app.all("*", (req: Request, res: Response) => {
          res.status(404).send({
                    message: "Not Found",
                    status: 404,
          });
});
export { app };
