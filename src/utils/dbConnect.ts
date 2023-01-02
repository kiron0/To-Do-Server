import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI as string;

const dbConnect = async (): Promise<void> => {
  try {
    const client = await MongoClient.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
}

export default dbConnect;
