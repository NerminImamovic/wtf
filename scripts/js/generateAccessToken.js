const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const generateAccessToken = () => jwt.sign({ acronym: 'acronym' }, JWT_SECRET);

console.log(`AccessToken: ${generateAccessToken()}`);
