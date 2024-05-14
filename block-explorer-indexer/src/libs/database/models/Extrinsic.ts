import mongoosePaginate from '@/mongoose-paginate-v2';
import { IExtrinsic } from '@/types';
import Mongoose, { Schema } from 'mongoose';

const schema = new Schema<IExtrinsic, Mongoose.Model<IExtrinsic>>({
  block: { type: Number },
  hash: { type: String },
  timestamp: { type: Number },
  extrinsicId: { type: String },
  retroExtrinsicId: { type: String },
  args: { type: Object },
  method: { type: String },
  section: { type: String },
  isSigned: { type: Boolean },
  signature: { type: String },
  signer: { type: String },
  fee: { type: Object },
  proxyFee: { type: Object },
  isSuccess: { type: Boolean },
  errorInfo: { type: String },
  isProxy: { type: Boolean },
  proxiedSections: [{ type: String }],
  proxiedMethods: [{ type: String }],
});

schema.index({ extrinsicId: 1 });
schema.index({ retroExtrinsicId: 1 });
schema.index({ method: 1 });
schema.index({ section: 1 });
schema.index({ block: 1 });
schema.index({ block: -1 });
schema.index({ timestamp: 1 });
schema.index({ timestamp: -1 });
schema.index({ signer: 1 });
schema.index({ block: -1, timestamp: -1 });
schema.index({ block: 1, timestamp: 1 });
schema.index({ method: 1, section: 1, block: -1 });
schema.index({ section: 1, method: 1, block: -1, timestamp: -1 });
schema.index({ proxiedMethods: 1 });
schema.index({ proxiedSection: 1 });
schema.index({ isProxy: 1 });
schema.index({ isSigned: 1 });
schema.index({ signer: 1, 'args.futurepass': 1 });
schema.index({ signer: 1, block: -1 });
schema.index({ 'args.futurepass': 1, block: -1 });
schema.index({ signer: 1, 'args.futurepass': 1, block: -1 });

// Use case specific Indexes
/** XRPL Bridge */
schema.index({ 'args.transaction.payment.address': 1 });
schema.index({ 'args.transaction_hash': 1 });
schema.index({ 'args.transaction_hash': 1, section: 1 });

/** ERC20 Peg */
schema.index({ 'args.beneficiary': 1 });

schema.virtual('proxyFeeToken', {
  ref: 'Token',
  localField: 'proxyFee.paymentAsset',
  foreignField: 'assetId',
  justOne: true,
});

// Bridge processingOk lookups
// XRPL
// "args.XrplTxHash" in events
schema.virtual('xrplProcessingOk', {
  ref: 'Event',
  localField: 'args.transaction_hash',
  foreignField: 'args.XrplTxHash',
  justOne: true,
});

schema.virtual('allEvents', {
  ref: 'Event',
  localField: 'extrinsicId',
  foreignField: 'extrinsicId',
});

schema.virtual('bridgeErc20Token', {
  ref: 'Token',
  localField: 'args.erc20Value.tokenAddress',
  foreignField: 'ethereumContractAddress',
  justOne: true,
});

schema.virtual('bridgeErc721Token', {
  ref: 'Token',
  localField: 'args.erc721Value.tokenAddress',
  foreignField: 'ethereumContractAddress',
  justOne: true,
});

schema.plugin(mongoosePaginate);

const Model = Mongoose.model<IExtrinsic, Mongoose.PaginateModel<IExtrinsic>>('Extrinsic', schema);

Model.syncIndexes();

export default Model;
