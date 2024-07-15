import mongoosePaginate from '@/mongoose-paginate-v2';
import { IEVMTransaction } from '@/types';
import Mongoose, { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<IEVMTransaction, Mongoose.Model<IEVMTransaction>>({
  hash: { type: String },
  accessList: [{ type: String }],
  blockNumber: { type: Number },
  contractAddress: { type: String },
  status: { type: String },
  gas: { type: Number },
  gasUsed: { type: Number },
  transactionIndex: { type: Number },
  gasPrice: { type: String },
  maxPriorityFeePerGas: { type: String },
  timestamp: { type: Number },
  tags: [{ type: String }],
  events: [{ type: Object }],
  effectiveGasPrice: { type: String },
  functionName: { type: String },
  functionSignature: { type: String },
  functionData: { type: Object },
  deployData: { type: Object },
  value: { type: Number },
  valueFormatted: { type: String },
  type: { type: String },
  transactionFee: { type: String },
  nonce: { type: Number },
  logs: [{ type: Object }],
  input: { type: String },
  from: { type: String },
  to: { type: String },
  _nftOwnersProcessed: { type: Boolean },
});

schema.index({ hash: 1 });
schema.index({ blockNumber: 1 });
schema.index({ from: 1, to: 1 });
schema.index({ from: 1 });
schema.index({ from: 1, blockNumber: -1 });
schema.index({ to: 1, blockNumber: -1 });
schema.index({ to: 1 });
schema.index({ 'events.eventName': 1 });

schema.index({ from: 1, 'events.eventName': 1, 'events.owner': 1 });
schema.index({ 'events.tokenId': 1, 'events.address': 1 });
schema.index({ 'events.from': 1, 'events.to': 1 });
schema.index({ 'events.from': 1, 'events.to': 1, 'events.type': 1 });
schema.index({ 'events.from': 1, 'events.to': 1, 'events.type': 1, 'events.eventName': 1 });
schema.index({ 'events.eventName': 1, 'events.type': 1, 'events.address': 1 });

schema.virtual('fromLookup', {
  ref: 'Address',
  localField: 'from',
  foreignField: 'address',
  select: 'isContract address rns nameTag',
  justOne: true,
});

schema.virtual('toLookup', {
  ref: 'Address',
  localField: 'to',
  foreignField: 'address',
  select: 'isContract address rns nameTag',
  justOne: true,
});

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);

const Model = Mongoose.model<IEVMTransaction, Mongoose.PaginateModel<IEVMTransaction>>('EVMTransaction', schema);

Model.syncIndexes();

export default Model;
