import { Response, Request } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from 'inversify-express-utils';

import { SOMETHING_WENT_WRONG_ERROR } from '../constants';
import logger from '../lib/logger';
import { authenticate, validateAcronymBody } from '../middleware';
import IAcronymService from '../services/interfaces/IAcronymService';
import { GetAcronymOptions } from '../types';

@controller('/acronym')
export default class AcronymController {
  constructor(
    @inject('IAcronymService') private acronymService: IAcronymService
  ) {}

  @httpGet('/')
  public async getAcronyms(req: Request, res: Response) {
    const options = {
      limit: +req.query.limit || 10,
      skip: req.query.from ? +req.query.from - 1 : 0,
      search: req.query.search || '',
    } as GetAcronymOptions;

    try {
      const data = await this.acronymService.getAcronyms(options);

      const upperBorder = Math.min(
        options.skip + options.limit,
        data.totalCount
      );

      const lowerBorder = Math.min(
        options.skip + 1,
        data.totalCount,
      );

      return res
        .status(206)
        .set(
          'Content-Range',
          `acronyms ${lowerBorder} - ${upperBorder}/${data.totalCount}`
        )
        .json(data.acronyms);
    } catch (err) {
      const errStatus = err.status || 500;
      const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

      return res.status(errStatus).json({ message: errorMessage });
    }
  }

  @httpPost('/', validateAcronymBody)
  public async createAcronym(req: Request, res: Response) {
    logger.info('POST /acronym');

    try {
      await this.acronymService.createAcronym(req.body);

      return res.status(201).json();
    } catch (err) {
      const errStatus = err.status || 500;
      const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

      return res.status(errStatus).json({ message: errorMessage });
    }
  }

  @httpPut('/:acronym', authenticate, validateAcronymBody)
  public async updateAcronym(req: Request, res: Response) {
    logger.info('PUT /acronym/:acronym');

    const acroynm = decodeURIComponent(req.params.acronym);

    try {
      await this.acronymService.updateAcronym(acroynm, req.body);

      res.status(204);
    } catch (err) {
      const errStatus = err.status || 500;
      const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

      return res.status(errStatus).json({ message: errorMessage });
    }
  }

  @httpDelete('/:acronym', authenticate)
  public async deleteAcronym(req: Request, res: Response) {
    logger.info('delete /acronym/:acronym');

    const acroynm = decodeURIComponent(req.params.acronym);

    try {
      await this.acronymService.deleteAcronym(acroynm);
      res.status(204);
    } catch (err) {
      const errStatus = err.status || 500;
      const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

      return res.status(errStatus).json({ message: errorMessage });
    }
  }
}
