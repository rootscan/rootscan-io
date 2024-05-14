import mongoosePaginate from '@/mongoose-paginate-v2';
import { IToken } from '@/types';
import Mongoose, { Schema } from 'mongoose';

const schema = new Schema<IToken, Mongoose.Model<IToken>>({
  type: { type: String },
  name: { type: String },
  symbol: { type: String },
  decimals: { type: Number },
  uri: { type: String },
  contractAddress: { type: String },
  ethereumContractAddress: { type: String },
  assetId: { type: Number },
  collectionId: { type: Number },
  totalSupply: { type: Number },
  totalSupplyFormatted: { type: Number },
  priceData: { type: Object },
});

schema.index({ contractAddress: 1 }, { unique: true });
schema.index({ assetId: 1 });
schema.index({ type: 1, totalSupply: 1 });
schema.index({ collectionId: 1 });
schema.index({ totalSupply: 1 });
schema.index({ type: 1 });
schema.index({ assetId: -1, collectionId: -1 });
schema.index({ assetId: 1, collectionId: 1 });
schema.index({ contractAddress: 1, type: 1, totalSupply: 1 });

schema.plugin(mongoosePaginate);

const Model = Mongoose.model<IToken, Mongoose.PaginateModel<IToken>>('Token', schema);

Model.syncIndexes();

export default Model;
