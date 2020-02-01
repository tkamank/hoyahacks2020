import axios from "axios";
import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import fs from "fs";

const router = Router();

router.post("/join", validateRequest, async (req: Request, res: Response) => {
  // @ts-ignore
  const payload = req.payload || ({} as TokenPayload);
  if (req.files.identification) {
    const identificationFile = req.files.identification;
    // @ts-ignore
    const buffer = await fs.readFileSync(identificationFile.tempFilePath)
      .buffer;
    // @ts-ignore
    const base64 = Buffer.from(buffer, "binary").toString("base64");
    try {
      const result = await axios({
        url: `https://vision.googleapis.com/v1/images:annotate?key=${process.env.API_KEY}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        data: {
          requests: [
            {
              image: {
                content: base64,
              },
              features: [
                {
                  type: "TEXT_DETECTION",
                },
              ],
            },
          ],
        },
      });
      res.status(200).json({
        payload,
        files: req.files,
        // url: `data:image/jpeg;base64,${base64}`,
        result: result.data
      });
    } catch (err) {
      res.status(500).json(err.response || err);
    }
  } else {
    res.status(400).send("Missing identification file.");
  }
});

export default router;
