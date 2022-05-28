import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';

import Application from './application';
import Container from './config/container';
import {
  PORT, NODE_ENV, TEST_ENV, DEVELOPMENT_ENV,
} from './constants';
import logger from './lib/logger';

const server = new InversifyExpressServer(
  Container.instance,
  null,
  null,
  Application.instance
);

const serverInstance = server.build();

if (NODE_ENV !== TEST_ENV) {
  serverInstance.listen(PORT, () => {
    if (NODE_ENV === DEVELOPMENT_ENV) {
      logger.info(`Server is listening on http://localhost:${PORT}`);
    }
  });
}

export default serverInstance;
