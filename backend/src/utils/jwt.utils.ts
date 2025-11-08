import jwt from "jsonwebtoken";

// Обов'язкова змінна оточення
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined in environment variables");
}

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as jwt.Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "30d";

export const generateToken = (userId: string): string => {
    const payload = { userId, type: "access" };
    const options: jwt.SignOptions = {
        expiresIn: JWT_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"],
        issuer: "phishtrainer",
        audience: "phishtrainer-api",
    };
    return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (userId: string): string => {
    const payload = { userId, type: "refresh" };
    const options: jwt.SignOptions = {
        expiresIn:
            JWT_REFRESH_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"],
        issuer: "phishtrainer",
        audience: "phishtrainer-api",
    };
    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (
    token: string
): { userId: string; type: string } => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: "phishtrainer",
            audience: "phishtrainer-api",
        }) as { userId: string; type: string };

        if (!decoded.userId || typeof decoded.userId !== "string") {
            throw new Error("Invalid token payload");
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Invalid token");
        }
        throw error;
    }
};
