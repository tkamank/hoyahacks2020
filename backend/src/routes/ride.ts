import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { Database } from "../lib/utils";
import {
  RequestRideRequestBody,
  CancelRideRequestRequestBody,
} from "../lib/types";

const router = Router();

router.get("/", validateRequest, async (req: Request, res: Response) => {
  // @ts-ignore
  const payload = req.payload || ({} as TokenPayload);
  try {
    const ride = await Database.Ride.activeRide(payload.sub);
    res.status(200).json(ride);
  } catch {
    res.status(500).send();
  }
});

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
      const activeRide = await Database.Ride.activeRide(payload.sub);
      if (!activeRide) {
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

router.post("/cancel", validateRequest, async (req: Request, res: Response) => {
  const { id = "" } = req.body as CancelRideRequestRequestBody;
  if (id.length === 0) {
    res.status(400).send();
    return;
  }
  // @ts-ignore
  const payload = req.payload || ({} as TokenPayload);
  const rideRequestId: number = parseInt(id, 10);
  try {
    const cancelled = await Database.Ride.cancel(rideRequestId, payload.sub);
    if (cancelled) {
      res.status(200).send();
    } else {
      res.status(403).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

export default router;
