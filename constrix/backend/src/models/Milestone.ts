import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone extends Document {
  habitId: mongoose.Types.ObjectId;
  milestoneDays: number;
  achievedAt: Date;
  blockchainSynced: boolean;
  txHash?: string;
}

const MilestoneSchema = new Schema<IMilestone>({
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
  milestoneDays: { type: Number, required: true },
  achievedAt: { type: Date, default: Date.now },
  blockchainSynced: { type: Boolean, default: false, index: true },
  txHash: { type: String }
});

// Compound unique index for habit + milestone days
MilestoneSchema.index({ habitId: 1, milestoneDays: 1 }, { unique: true });

export default mongoose.model<IMilestone>('Milestone', MilestoneSchema);