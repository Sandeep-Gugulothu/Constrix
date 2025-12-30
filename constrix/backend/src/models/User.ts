import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true, index: true },
  username: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
