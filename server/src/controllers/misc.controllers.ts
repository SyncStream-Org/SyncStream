import { Request, Response } from "express";
import { Validation } from "syncstream-sharedlib";
import { version } from '../../package.json';


export const echo = async (req: Request, res: Response) => {
    if(!req.body) {
        res.status(400).json({ error: "No JSON body provided" });
        return;
    }

    if(!Validation.isStringMessage(req.body)) {
        res.status(404).json({ error: "String Message not Present"});
    }

    req.body.msg = req.body.msg + "+" + version;

    res.json(req.body);
};
