import * as bodyparser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { Application, Request, Response } from "express";
import { validateRequest } from "./middleware";
import { TokenPayload } from "google-auth-library";

config();

const PORT = process.env.port || 8080;

const app = express() as Application;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.get("/", (_, res: Response) => {
  res.status(200).send("Hello, Hoya!");
});

app.get("/verify", validateRequest, (req: Request, res: Response) => {
  // @ts-ignore
  const payload = req.payload || {} as TokenPayload;
  res.status(200).json(payload);
});

app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server listening at http://localhost:${PORT}`);
});