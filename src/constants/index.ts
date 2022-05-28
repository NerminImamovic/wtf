require('dotenv').config();

export const {
  MONGO_URL, NODE_ENV, JWT_SECRET, PORT,
} = process.env;

export const SOMETHING_WENT_WRONG_ERROR = 'Something went wrong. For more information contact us on email: nimamovic9@gmail.com';
export const TEST_ENV = 'test';
export const DEVELOPMENT_ENV = 'development';
export const MONGO_DUPLICATE_KEY_ERROR_CODE = 11000;
