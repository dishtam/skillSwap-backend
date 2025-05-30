import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = schema.safeParse(req.body);

        if(!parsedBody.success){
            const errors = parsedBody.error.errors.map( e => e.message).join(",");
            res.status(400).json({
                error: errors
            });
            return;
        }

        req.body = parsedBody.data;
        next();
    };   
}