import * as bodyparser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { Application, Response } from "express";
import driver from "./routes/driver";
import user from "./routes/user";
import { Database } from "./lib/utils";

config();

Database.seed();

const PORT = process.env.port || 8080;

const app = express() as Application;

app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyparser.json({ limit: "50mb" }));
app.use(cors());

app.get("/", (_, res: Response) => {
  res.status(200).send("Hello, Hoya!");
});

app.use("/driver", driver);
app.use("/user", user);

app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server listening at http://localhost:${PORT}`);
});
