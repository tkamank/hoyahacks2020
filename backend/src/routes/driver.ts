import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { RegisterAsNewDriverRequestBody } from "../lib/types";
import { GCV, Database } from "../lib/utils";

const router = Router();

router.get(
  "/",
  validateRequest,
  async (req: Request, res: Response) => {
    // @ts-ignore
    const payload = req.payload || ({} as TokenPayload);
    try {
      const ride = await Database.Ride.activeDrive(payload.sub);
      res.status(200).json(ride);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.post("/join", validateRequest, async (req: Request, res: Response) => {
  const { image = "" } = req.body as RegisterAsNewDriverRequestBody;
  if (image.length === 0) {
    res.status(400).send();
    return;
  }
  // @ts-ignore
  const payload = req.payload || ({} as TokenPayload);
  try {
    // TODO: Resolve this on the server
    const token = req.headers.authorization.split(" ")[1];
    await GCV.annotateImage(token, image);
    await Database.User.updateDriverStatus(payload.sub, true);
    // await Database.DriversLicenses.create(payload.email, image);
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get(
  "/passengers",
  validateRequest,
  async (req: Request, res: Response) => {
    // @ts-ignore
    const payload = req.payload || ({} as TokenPayload);
    try {
      const rideRequests = await Database.Ride.get(payload.sub);
      res.status(200).json(rideRequests);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

export default router;
