import { Request, Response } from "express";
//import * as service from "../services/user.service";

import { Validation } from "syncstream-sharedlib";

import { version } from '../../package.json';
import path from 'path';
import fs from 'fs';

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

export const getAPI = async (req: Request, res: Response) => {
    const filePath = path.join(__dirname, '../../../docs/api.yaml');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('unable to read API spec');
        } else {
            res.type('yaml').send(data);
        }
    })
}