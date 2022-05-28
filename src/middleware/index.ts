import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../constants';
import { HttpError } from '../helpers/errors/HttpError';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.auth;
  const token = authHeader
  && authHeader.substring(0, 7) === 'Bearer ' && authHeader.split(' ')[1];

  if (!token) {
    const httpError = new HttpError({
      status: 401,
      message: 'User should provide token.',
    });

    return res.status(httpError.status).json({ message: httpError.message });
  }

  jwt.verify(token, JWT_SECRET, err => {
    if (err) {
      const httpError = new HttpError({
        status: 401,
        message: 'Token is not valid.',
      });

      return res.status(httpError.status).json({ message: httpError.message });
    }
    next();
  });
};

const validateAcronymBody = (req, res, next) => {
  if (!req.body.name || !req.body.definition) {
    const httpError = new HttpError({
      status: 400,
      message: 'Acronym should have name and description.',
    });

    return res.status(httpError.status).json({ message: httpError.message });
  }
  next();
};

export {
  authenticate,
  validateAcronymBody,
};
