import { Model, Schema, model } from 'mongoose';

import { Acronym as AcronymType } from '../types';

type AcronymModel = Model<AcronymType>;

const AcronymSchema = new Schema<AcronymType>({
  name: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
});

AcronymSchema.index({ name: 1, definition: 1 }, { unique: true });

const Acronym: AcronymModel = model<AcronymType, AcronymModel>(
  'Acronym',
  AcronymSchema
);

export default Acronym;
