import type { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import config from '../config';

const generateToken = (jwtPayload: JwtPayload, secret: Secret, expiresIn: string) => {
  return jwt.sign(jwtPayload, secret, {
    algorithm: 'HS256',
    expiresIn,
  } as SignOptions);
};

const generateAuthTokens = (user: {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  userRole: string;
}): { accessToken: string; refreshToken: string } => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    userRole: user.userRole,
  };
  const accessToken = generateToken(
    payload,
    config.JWT.JWT_ACCESS_SECRET as Secret,
    config.JWT.JWT_ACCESS_EXPIRES,
  );
  const refreshToken = generateToken(
    payload,
    config.JWT.JWT_REFRESH_SECRET as Secret,
    config.JWT.JWT_REFRESH_EXPIRES,
  );
  return { accessToken, refreshToken };
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  generateAuthTokens,
  verifyToken,
};
