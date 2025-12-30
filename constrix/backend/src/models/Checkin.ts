import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckin extends Document {
  habitId: mongoose.Types.ObjectId;
  checkinDate: Date;
  proofData?: Record<string, any>;
  createdAt: Date;
}

const CheckinSchema = new Schema<ICheckin>({
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
  checkinDate: { type: Date, required: true, index: true },
  proofData: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index for habit + date
CheckinSchema.index({ habitId: 1, checkinDate: 1 }, { unique: true });

export default mongoose.model<ICheckin>('Checkin', CheckinSchema);