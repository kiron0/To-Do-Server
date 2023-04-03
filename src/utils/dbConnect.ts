import { MongoClient } from "mongodb";
import colors from "colors";

const uri = process.env.MONGO_URI as string;

const dbConnect = async (): Promise<void> => {
  try {
    const client = await MongoClient.connect(uri);
    console.log(colors.yellow.bold.italic(`Connected to MongoDB`));
  } catch (error) {
    console.log(colors.yellow.bold.italic(`Error connecting to MongoDB: ", ${error}`));
  }
}

export default dbConnect;
