import jwt from "express-jwt";
import {Request} from "express";

const getTokenFromHeaders = (req: Request) => {
  const { headers: { authorization } } = req;

  if (authorization && authorization.split('=')[0] === 'Token') {
    return authorization.split('=')[1];
  }
  return null;
};

export const auth = {
  required: jwt({
    algorithms: ['HS256'],
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    algorithms: ['HS256'],
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};
