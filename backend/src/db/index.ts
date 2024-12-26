import mongoose from "mongoose";
import { DB_NAME } from "../constats";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${"mongodb://127.0.0.1:27017"}/${DB_NAME}`
    );
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Connection Error", err);
    process.exit(1);
  }
};
export default connectDB;
