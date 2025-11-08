import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

export interface AuthRequest extends Request {
    userId?: string;
    body: any;
    params: any;
    query: any;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Спочатку перевіряємо Authorization header
        const authHeader = req.headers.authorization;
        let token: string | undefined;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.replace("Bearer ", "");
        }
        // Якщо немає в header, перевіряємо cookie
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                error: "Токен не надано",
                code: "NO_TOKEN",
            });
        }

        // Валідація токену
        const decoded = verifyToken(token);

        // Перевіряємо, що це access token
        if (decoded.type !== "access") {
            return res.status(401).json({
                error: "Невалідний тип токену",
                code: "INVALID_TOKEN_TYPE",
            });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Невалідний токен";

        return res.status(401).json({
            error: errorMessage,
            code:
                errorMessage === "Token expired"
                    ? "TOKEN_EXPIRED"
                    : "INVALID_TOKEN",
        });
    }
};
