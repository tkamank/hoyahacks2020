import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { RegisterAsNewDriverRequestBody } from "../lib/types";
import { GCV, Database } from "../lib/utils";

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
    const result = await GCV.annotateImage(image);
    await Database.User.updateDriverStatus(payload.sub, true);
    await Database.DriversLicenses.create(payload.email, image);
    res.status(200).json({ result: result.data });
  } catch (err) {
    res.status(500).json(err.response || err);
  }
});

export default router;
