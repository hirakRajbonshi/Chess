import express from "express";
import cors from "cors";

import testingRouter from "./routes/testing.routes";
import userRouter from "./routes/auth.routes";

const app = express();
app.use(
  cors({
    origin: "*", //TODO: .env
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/testing", testingRouter);
app.use("/auth", userRouter);
export { app };
