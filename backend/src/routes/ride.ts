import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { Database } from "../lib/utils";
import { RequestRideRequestBody } from "../lib/types";

const router = Router();

router.get("/", validateRequest, async (req: Request, res: Response) => {
    // @ts-ignore
    const payload = req.payload || ({} as TokenPayload);
    try {
      const existsForRider = await Database.Ride.exitsForRider(payload.sub);
      res.status(200).json(existsForRider);
    } catch {
      res.status(500).send();
    }
})

router.post(
  "/request",
  validateRequest,
  async (req: Request, res: Response) => {
    const { location = "" } = req.body as RequestRideRequestBody;
    if (location.length === 0) {
      res.status(400).send();
      return;
    }
    // @ts-ignore
    const payload = req.payload || ({} as TokenPayload);
    const locationId: number = parseInt(location, 10);
    try {
      const existsForRider = await Database.Ride.exitsForRider(payload.sub);
      if (!existsForRider) {
        await Database.Ride.create(payload.sub, locationId);
        res.status(200).send();
      } else {
        res.status(403).send();
      }
    } catch {
      res.status(500).send();
    }
  }
);

export default router;
