import { Acronym, GetAcronymOptions, GetAcronymsResponse } from '../../types';

interface IAcronymService {
  createAcronym(acronym: Acronym): Promise<Acronym>;
  deleteAcronym(acronym: string): Promise<void>;
  getAcronyms(options: GetAcronymOptions): Promise<GetAcronymsResponse>;
  updateAcronym(acronymValue: string, acronym: Acronym): Promise<void>;
}

export default IAcronymService;
