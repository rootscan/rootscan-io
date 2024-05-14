import mongoosePaginate from '@/mongoose-paginate-v2';
import { IBlock } from '@/types';
import Mongoose, { Schema } from 'mongoose';

const schema = new Schema<IBlock, Mongoose.Model<IBlock>>({
  number: { type: Number },
  isFinalized: { type: Boolean, default: false },
  timestamp: { type: Number },
  hash: { type: String },
  parentHash: { type: String },
  stateRoot: { type: String },
  extrinsicsRoot: { type: String },
  evmBlock: {
    hash: { type: String },
    parentHash: { type: String },
    stateRoot: { type: String },
    miner: { type: String },
  },
  extrinsicsCount: { type: Number },
  transactionsCount: { type: Number },
  eventsCount: { type: Number },
  spec: { type: String },
});

schema.index({ number: 1 }, { unique: true });
schema.index({ hash: 1 });
schema.index({ timestamp: 1 });
schema.index({ number: -1 });
schema.index({ isFinalized: 1 });
schema.index({ isFinalized: 1, number: 1 });
schema.index({ 'evmBlock.miner': 1 });
schema.index({ timestamp: 1, 'evmBlock.miner': 1 });

schema.plugin(mongoosePaginate);

const Model = Mongoose.model<IBlock, Mongoose.PaginateModel<IBlock>>('Block', schema);

Model.syncIndexes();

export default Model;
