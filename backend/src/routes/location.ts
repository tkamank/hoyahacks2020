import { Router, Request, Response } from "express";
import axios from "axios";
import { validateRequest } from "../middleware";
import { GetLocationNameFromCoordinatesQuery } from "../lib/types";

const router = Router();

router.get("/", validateRequest, async (req: Request, res: Response) => {
    const { latitude = "" , longitude = "" } = req.query as GetLocationNameFromCoordinatesQuery;
    if(latitude.length === 0 || longitude.length === 0){
        res.status(400).send();
        return;
    }
    try {
        const result = await axios({
            method: "GET",
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.API_KEY}`
        });
        if (result.status !== 200) {
            throw result.data;
        }
        res.status(200).json(result.data);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

export default router;
