import jwt from 'jsonwebtoken';
import { userModel } from '../postgres/postgres.js';
import { sendResponse } from '../controller/responseHandler.js';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyto3sgqFWmzOLeN4LspR
YoBXBjoIIpv7ahYM4hyOZDY6MXH6H0dhlgUQPOq7ibK5IPpd+ufZ9tDuob3ZaRFNA
7+PUOeyt9mxCLPyjuG4Myii/wjBcVZ6skWQgLcLLTVS2DebKc6z5HeodeDk3qFJp/
vwCqjG4IW81ekiiHwiDE+tEU1maFUaEZTvb7K0NH/OuaXiWXEqhjel9ohbkObrVwD
Bg19ve6aATo7fsLFsjq+61q6WocppFJngD6pO/pY3yXZ8rGuxOmKQ9SYa0j8SHCFo
qkNdDoYHHnC1/s3s9ISnHbhbbDIBkxLzN+wE69GB01tNA8gWTWEB4gyqRgAcWwIDAQAB
-----END PUBLIC KEY-----`;

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, 'AUTH_001', 'Access token missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  const decodedWithoutVerify = jwt.decode(token);
  console.log("Decoded token (no verify):", decodedWithoutVerify);
  console.log("exp:", decodedWithoutVerify?.exp);
  console.log("Current time:", Math.floor(Date.now() / 1000));

  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      clockTolerance: 60 // allow small clock skew
    });

    console.log("✅ Token verified successfully");

    // const email = decoded.preferred_username;
     const email = decoded.email;
    if (!email) {
      return sendResponse(res, 401, 'AUTH_003', 'Username not found in token');
    }

    const user = await userModel.findOne({
      where: { email },
      attributes: ['email'],
    });

    if (!user) {
      return sendResponse(res, 403, 'AUTH_004', 'User not found or unauthorized');
    }

    req.user = {
      id: user.id,
      username: user.email,
      // role: user.designation,
    };
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.name, err.message);
    return sendResponse(res, 403, 'AUTH_005', err.message || 'Invalid or expired token');
  }
};
