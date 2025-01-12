import mongoose, { Document, Schema, Types } from 'mongoose';

interface Beneficiary {
  userId: string;  
  email: string;
  claimEmailSent: boolean;  
}

export interface IWill extends Document {
  userId: string;
  willId: string;
  email: string;
  creationDate: Date;
  lastConfirmed: Date | null;
  beneficiaries: Beneficiary[];
  status: 'active' | 'inactive' | 'notified' | 'distributed';
  lastNotificationSent: Date | null;
}

const BeneficiarySchema = new Schema<Beneficiary>({
  email: { type: String, required: true },
  userId: { type: String, required: true }, 
  claimEmailSent: { type: Boolean, default: false },
});

const WillSchema = new Schema<IWill>({
  userId: { type: String, required: true },
  willId: { type: String, default: () => new Types.ObjectId().toString() },
  email: { type: String, required: true },
  creationDate: { type: Date, required: true },
  lastConfirmed: { type: Date, default: null },
  beneficiaries: { type: [BeneficiarySchema], required: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'notified', 'distributed'],
    default: 'active',
  },
  lastNotificationSent: { type: Date, default: null },
});

export default mongoose.model<IWill>('Will', WillSchema);
