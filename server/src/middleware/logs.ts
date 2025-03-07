import { Request, Response, NextFunction } from "express";

import Logger from "../utils/logger";

export const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('test');
    res.on('finish', () => {
    const method = req.method;
    const path = req.originalUrl;

    // TODO
    Logger.info(`{${method} ${path}}:{status ${res.statusCode}}`);

    next();
    });
};

export const preLoggingMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info('test');
    next();
}