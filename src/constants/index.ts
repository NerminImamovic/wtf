require('dotenv').config();

export const {
  MONGO_URL, NODE_ENV, JWT_SECRET, PORT,
} = process.env;

export const SOMETHING_WENT_WRONG_ERROR = 'Something went wrong. For more information contact us on email: nimamovic9@gmail.com';
export const TEST_ENV = 'test';
export const DEVELOPMENT_ENV = 'development';
export const MONGO_DUPLICATE_KEY_ERROR_CODE = 11000;

export const STATUS_CODE_CRATED = 201;
export const STATUS_CODE_NO_CONTENT = 204;
export const STATUS_CODE_PARTIAL_CONTENT = 206;

export const STATUS_CODE_BAD_REQUEST_ERROR = 400;
export const STATUS_CODE_UNAUTHORIZED_ERROR = 401;
export const STATUS_CODE_FORBIDDEN_ERROR = 403;
export const STATUS_CODE_NOT_FOUND_ERROR = 404;
export const STATUS_CODE_CONFLICT_ERROR = 409;

export const STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
