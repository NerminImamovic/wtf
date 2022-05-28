import logger from '../../lib/logger';

class HttpError extends Error {
  public status: number;

  public constructor({ status, message }: { message: string; status: number }) {
    super(message);
    this.status = status;

    this.logError();
  }

  private logError() {
    logger.error(`${this.status}: ${this.message}`);
  }
}

export { HttpError };
