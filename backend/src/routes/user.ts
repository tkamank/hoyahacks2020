import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { Database } from "../lib/utils";

const router = Router();

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


export default router;
