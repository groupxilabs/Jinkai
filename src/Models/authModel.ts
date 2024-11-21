import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
}

const UserSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
});

export default mongoose.model<IUser>('User', UserSchema);
