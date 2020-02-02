import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { Database } from "../lib/utils";
import { UpdateUserLocationRequestBody } from "../lib/types";

const router = Router();

router.get("/", validateRequest, async (req: Request, res: Response) => {
  // @ts-ignore
  const payload = req.payload as TokenPayload;
  try {
    const user = await Database.User.read(payload.sub);
    res.status(200).json(user);
  } catch {
    res.status(401).send();
  }
});

router.post("/create", validateRequest, async (req: Request, res: Response) => {
  // @ts-ignore
  const payload = req.payload as TokenPayload;
  try {
    await Database.User.create(payload.sub, payload.email);
    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post(
  "/update-location",
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      latitude = "",
      longitude = "",
    } = req.body as UpdateUserLocationRequestBody;
    if (latitude.length === 0 || longitude.length === 0) {
      res.status(400).send();
      return;
    }
    // @ts-ignore
    const payload = req.payload as TokenPayload;
    try {
      await Database.User.updateLocation(payload.sub, latitude, longitude);
      res.status(200).send();
    } catch (err) {
      res.status(500).send();
    }
  }
);

export default router;
