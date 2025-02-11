import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.SECRET_KEY ?? 'SampleToken';
const SALT_ROUNDS = 10;

export function generateToken(username: string): string {
  const payload = {
    username: username
  };
  return jwt.sign(payload, SECRET, { expiresIn: '10h' });
}

export async function verifyToken(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err: Error | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        reject(new Error('Invalid token'));
      } else {
        if (typeof decoded === 'string') {
          resolve(decoded);
        } else if (typeof decoded !== 'undefined') {
          resolve(decoded.username);
        } else {
          reject(new Error('Invalid token'));
        }
      }
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash);
}

