import axios from "axios";
import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { RegisterAsNewDriverRequestBody } from "../lib/types";

const router = Router();

router.post("/join", validateRequest, async (req: Request, res: Response) => {
  const { image = "" } = req.body as RegisterAsNewDriverRequestBody;
  if (image.length === 0) {
    res.status(400).send();
    return;
  }
  // @ts-ignore
  const payload = req.payload || ({} as TokenPayload);
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
              content: image,
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
      result: result.data,
    });
  } catch (err) {
    res.status(500).json(err.response || err);
  }
});

export default router;
