import mongoosePaginate from '@/mongoose-paginate-v2';
import { IStakingValidator } from '@/types';
import Mongoose, { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<IStakingValidator, Mongoose.Model<IStakingValidator>>({
  era: { type: Number },
  validatorName: { type: String },
  validator: { type: String },
  nominators: { type: Number },
  totalRootNominated: { type: Number },
  isOversubscribed: { type: Boolean },
});

schema.index({ validator: 1 });
schema.index({ era: 1 });
schema.index({ era: -1 });

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);

const Model = Mongoose.model<IStakingValidator, Mongoose.PaginateModel<IStakingValidator>>('StakingValidator', schema);

Model.syncIndexes();

export default Model;
