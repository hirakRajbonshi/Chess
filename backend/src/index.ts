import dotenv from "dotenv";
import { app } from "./app";
import { PORT } from "./constats";
import connectDB from "./db";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((err) => {
    console.log("DB Connection Error", err);
  });
