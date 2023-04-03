import { app } from "./app";
import colors from "colors";
import dbConnect from "./utils/dbConnect";

const port: string | number = process.env.PORT || 8000;
const startServer = async (): Promise<void> => {
  try {
    app.listen(port, () => {
      console.log(colors.green.bold.italic(`Server is running on port ${port}`));
      dbConnect(); // temp db connection
    });
  } catch (error) {
    console.log(colors.red.bold.italic(`Error starting server: ", ${error}`));
  }
};
startServer();
