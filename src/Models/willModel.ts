import mongoose, { Document, Schema, Types } from 'mongoose';

interface IWill extends Document {
  userId: string;
  willId: string;
  email: string;
  creationDate: Date;
  lastConfirmed: Date | null;
  beneficiaries: string[];
  status: 'active' | 'inactive' | 'distributed';
}

const WillSchema = new Schema<IWill>({
  userId: { type: String, required: true },
  willId: { type: String, default: () => new Types.ObjectId().toString() }, 
  email: { type: String, },
  creationDate: { type: Date, required: true },
  lastConfirmed: { type: Date, default: null },
  beneficiaries: { type: [String], required: true },
  status: { type: String, enum: ['active', 'inactive', 'distributed'], default: 'active' },
});

const Will = mongoose.model<IWill>('Will', WillSchema);
export default Will;
