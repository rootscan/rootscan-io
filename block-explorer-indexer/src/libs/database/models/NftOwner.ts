import mongoosePaginate from '@/mongoose-paginate-v2';
import { INftOwner } from '@/types';
import Mongoose, { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<INftOwner, Mongoose.Model<INftOwner>>({
  contractAddress: { type: String },
  collectionId: { type: Number },
  tokenId: { type: Schema.Types.Mixed },
  owner: { type: String },
  amount: { type: Number },
  timestamp: { type: Number },
  blockNumber: { type: Number },
  eventId: { type: String },
  image: { type: String },
  type: { type: String },
  animation_url: { type: String },
  attributes: { type: Object },
  transactionHash: { type: String },
});

schema.index({ contractAddress: 1, tokenId: 1 });
schema.index({ contractAddress: 1 });
schema.index({ contractAddress: 1, owner: 1 });
schema.index({ contractAddress: 1, tokenId: -1 });
schema.index({ blockNumber: 1 });
schema.index({ owner: 1 });
schema.index({ type: 1 });

schema.virtual('nftCollection', {
  ref: 'Token',
  localField: 'contractAddress',
  foreignField: 'contractAddress',
  justOne: true,
});

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);

const Model = Mongoose.model<INftOwner, Mongoose.PaginateModel<INftOwner>>('NftOwner', schema);

Model.syncIndexes();

export default Model;
