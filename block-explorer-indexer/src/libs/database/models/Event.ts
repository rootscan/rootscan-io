import mongoosePaginate from '@/mongoose-paginate-v2';
import { IEvent } from '@/types';
import Mongoose, { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<IEvent, Mongoose.Model<IEvent>>({
  eventId: { type: String },
  hash: { type: String },
  blockNumber: { type: Number },
  timestamp: { type: Number },
  extrinsicId: { type: String },
  method: { type: String },
  section: { type: String },
  doc: { type: String },
  args: { type: Object },
});

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);

schema.index({ eventId: 1 });
schema.index({ extrinsicId: 1 });
schema.index({ method: 1 });
schema.index({ section: 1, method: 1 });
schema.index({ section: 1, method: 1, blockNumber: -1 });
schema.index({ blockNumber: 1 });
schema.index({ blockNumber: -1 });
schema.index({ 'args.assetId': 1 });
schema.index({ 'args.from': 1 });
schema.index({ 'args.to': 1 });
schema.index({ 'args.who': 1 });
schema.index({ 'args.source': 1 });
schema.index({ 'args.trading_path': 1 });
schema.index({ 'args.tokenId': 1 });

// Bridge
schema.index({ 'args.XrplTxHash': 1 });

// Transfers Pallet
schema.index({ section: 1, method: 1, 'args.from': 1, blockNumber: -1 });
schema.index({ section: 1, method: 1, 'args.from': 1, timestamp: 1 });
schema.index({ section: 1, method: 1, 'args.to': 1, blockNumber: -1 });
schema.index({ section: 1, method: 1, 'args.to': 1, timestamp: 1 });
schema.index({ section: 1, method: 1, 'args.source': 1, blockNumber: -1 });
schema.index({ section: 1, method: 1, 'args.source': 1, timestamp: 1 });
schema.index({ section: 1, method: 1, 'args.owner': 1, blockNumber: -1 });
schema.index({ section: 1, method: 1, 'args.owner': 1, timestamp: 1 });
schema.index({ section: 1, method: 1, 'args.previousOwner': 1, blockNumber: -1 });
schema.index({ section: 1, method: 1, 'args.previousOwner': 1, timestamp: 1 });
schema.index({ section: 1, method: 1, 'args.newOwner': 1, blockNumber: -1 });
schema.index({ section: 1, method: 1, 'args.newOwner': 1, timestamp: 1 });
schema.index({ section: 1, method: 1, 'args.collectionId': 1 });
schema.index({ section: 1, method: 1, 'args.tokenId': 1 });

// Balances Pallet
schema.index({ section: 1, method: 1, 'args.who': 1, blockNumber: -1 });
// Dex
schema.index({ section: 1, method: 1, 'args.trading_path': 1 });
schema.index({ method: 1, section: 1, timestamp: -1 });

schema.virtual('token', {
  ref: 'Token',
  localField: 'args.assetId',
  foreignField: 'assetId',
  justOne: true,
});

schema.virtual('tokenNative', {
  ref: 'Token',
  localField: 'args.assetId',
  foreignField: 'assetId',
  match: {
    contractAddress: { $ne: null },
  },
  justOne: true,
});

schema.virtual('extrinsicData', {
  ref: 'Extrinsic',
  localField: 'extrinsicId',
  foreignField: 'extrinsicId',
  justOne: true,
});

schema.virtual('nftCollection', {
  ref: 'Token',
  localField: 'args.collectionId',
  foreignField: 'collectionId',
  justOne: true,
});

// Swap Populate
schema.virtual('swapFromToken', {
  ref: 'Token',
  localField: 'args.trading_path[0]',
  foreignField: 'assetId',
  justOne: true,
});

schema.virtual('swapToToken', {
  ref: 'Token',
  localField: 'args.trading_path[1]',
  foreignField: 'assetId',
  justOne: true,
});

const Model = Mongoose.model<IEvent, Mongoose.PaginateModel<IEvent>>('Event', schema);

Model.syncIndexes();

export default Model;
