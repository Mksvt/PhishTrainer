import jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = (process.env.JWT_SECRET ?? 'secret') as jwt.Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const generateToken = (userId: string): string => {
  const payload = { userId };
  const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as unknown as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
