"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => {
    return (req, res, next) => {
        const parsedBody = schema.safeParse(req.body);
        if (!parsedBody.success) {
            const errors = parsedBody.error.errors.map(e => e.message).join(",");
            res.status(400).json({
                error: errors
            });
            return;
        }
        req.body = parsedBody.data;
        next();
    };
};
exports.validateBody = validateBody;
