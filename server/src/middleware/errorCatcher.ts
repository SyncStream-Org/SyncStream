import { Request, Response, NextFunction } from "express";

export const ErrorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("*************************** INSIDE ERRORCATCHER ***************************")
    const errorMessage = err.message;
    const statusCode = 500; // this should be catching any uncaught errors, therefore all errors reaching this point are unknown

    // Log and send the error   
    //logger.error(`At:{${location}}:{${which}} got Code:${statusCode} -> Message: ${errorMessage}`); // TODO replace with actual error logging logic
    // TODO replace with logger when completed
    console.log(`UNCAUGHT SERVER ERROR => Message: ${errorMessage}`); 
    res.status(statusCode).json({ error: errorMessage });
    next();
}

export const ErrorCatcher = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => 
        Promise.resolve(fn(req, res, next)).catch(next);
