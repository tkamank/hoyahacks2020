import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { validateRequest } from "../middleware";
import { Database } from "../lib/utils";
import { RequestRideRequestBody } from "../lib/types";

const router = Router();

router.post("/request",validateRequest, async (req: Request, res: Response) => {
    const { location = "" } = req.body as RequestRideRequestBody;
    if (location.length === 0) {
        res.status(400).send();
        return;
    }
    // @ts-ignore
    const payload = req.payload || ({} as TokenPayload);
    const locationId: number = parseInt(location);
    try{
        await Database.Ride.create(payload.sub, locationId);
        res.status(200).send();
    }catch{
        res.status(500).send();
    }
});

export default router;
