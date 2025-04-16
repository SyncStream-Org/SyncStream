import { Request, Response } from "express";
//import * as service from "../services/user.service";

import path from 'path';
import fs from 'fs';

export const echo = async (req: Request, res: Response) => {
    if(!req.body) {
        res.status(400).json({ error: "No JSON body provided" });
        return;
      }
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