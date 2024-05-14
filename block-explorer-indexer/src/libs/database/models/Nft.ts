import mongoosePaginate from '@/mongoose-paginate-v2';
import { INFT } from '@/types';
import Mongoose, { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<INFT, Mongoose.Model<INFT>>({
  contractAddress: { type: String },
  tokenId: { type: Number },
  owner: { type: String },
  amount: { type: Number },
  image: { type: String },
  type: { type: String },
  animation_url: { type: String },
  attributes: { type: Object },
});

schema.index({ contractAddress: 1, tokenId: 1 });
schema.index({ contractAddress: 1 });
schema.index({ contractAddress: 1, owner: 1 });
schema.index({ contractAddress: 1, tokenId: -1 });
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

const Model = Mongoose.model<INFT, Mongoose.PaginateModel<INFT>>('Nft', schema);

Model.syncIndexes();

export default Model;
