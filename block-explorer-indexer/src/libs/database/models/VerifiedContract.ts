import mongoosePaginate from '@/mongoose-paginate-v2';
import { IVerifiedContract } from '@/types';
import Mongoose, { Schema } from 'mongoose';

const schema = new Schema<IVerifiedContract, Mongoose.Model<IVerifiedContract>>({
  address: { type: String },
  contractName: { type: String },
  abi: { type: Object },
  bytecode: { type: String },
  deployer: { type: String },
  deployedBlock: { type: Number },
});

schema.index({ address: 1 }, { unique: true });
schema.index({ deployedBlock: -1 });

schema.plugin(mongoosePaginate);

const Model = Mongoose.model<IVerifiedContract, Mongoose.PaginateModel<IVerifiedContract>>('VerifiedContract', schema);

Model.syncIndexes();

export default Model;
