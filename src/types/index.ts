export type GetAcronymOptions = {
  skip: number;
  limit: number;
  search: string;
};

export type Acronym = {
  name: string;
  definition: string;
};

export type GetAcronymsResponse = {
  acronyms: Acronym[];
  totalCount: number;
};
