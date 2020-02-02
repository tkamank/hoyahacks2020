import { Router, Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import axios from "axios";
import { validateRequest } from "../middleware";
import { GetLocationNameFromCoordinatesQuery } from "../lib/types";
import { Database } from "../lib/utils";

const router = Router();

router.get("/", validateRequest, async (req: Request, res: Response) => {
    const { latitude = "" , longitude = "" } = req.query as GetLocationNameFromCoordinatesQuery;
    if(latitude.length === 0 || longitude.length === 0){
        res.status(400).send();
        return;
    }
    // @ts-ignore
    const payload = req.payload || ({} as TokenPayload);
    try {
        const result = await axios({
            method: "GET",
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.API_KEY}`
        });
        if (result.status !== 200) {
            throw result.data;
        }
        const validResult = result.data["results"].find((element:any) => element["formatted_address"]) as any;
        if (validResult) { 
            await Database.Location.create(payload.sub, latitude, longitude, validResult["formatted_address"]);
            res.status(200).json({
                latitude,
                longitude,
                formatted_address: validResult["formatted_address"]
            });
        } else {
            res.status(404).send();
        }
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

router.get("/mine",validateRequest,async (req: Request, res: Response) => {
    // @ts-ignore
    const payload = req.payload || ({} as TokenPayload);
    try {
        const locations = await Database.Location.get(payload.sub);
        res.status(200).json(locations);
    } catch {
        res.status(500).send();
    }
});

export default router;
