import * as bodyparser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { Application, Response } from "express";
import fileUpload from "express-fileupload";
import driver from "./routes/driver";

config();

const PORT = process.env.port || 8080;

const app = express() as Application;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/", (_, res: Response) => {
  res.status(200).send("Hello, Hoya!");
});

app.use("/driver", driver);

app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server listening at http://localhost:${PORT}`);
});
