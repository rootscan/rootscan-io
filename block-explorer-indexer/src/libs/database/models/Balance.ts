import mongoosePaginate from '@/mongoose-paginate-v2';
import { IBalance } from '@/types';
import Mongoose, { Schema } from 'mongoose';

const schema = new Schema<IBalance, Mongoose.Model<IBalance>>({
  address: { type: String },
  contractAddress: { type: String },
  balance: { type: Number },
  balanceFormatted: { type: String },
});

schema.index({ address: 1, contractAddress: 1 }, { unique: true });
schema.index({ contractAddress: 1 });
schema.index({ address: 1 });

schema.virtual('tokenDetails', {
  ref: 'Token',
  localField: 'contractAddress',
  foreignField: 'contractAddress',
  select: 'name symbol',
  justOne: true,
});

schema.plugin(mongoosePaginate);

const Model = Mongoose.model<IBalance, Mongoose.PaginateModel<IBalance>>('Balance', schema);

Model.syncIndexes();

export default Model;
