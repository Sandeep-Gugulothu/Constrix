import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  habitType: 'study' | 'fitness';
  currentStreak: number;
  longestStreak: number;
  lastCheckin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  habitType: { 
    type: String, 
    required: true, 
    enum: ['study', 'fitness'],
    index: true 
  },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCheckin: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for user + habit type uniqueness
HabitSchema.index({ userId: 1, habitType: 1 }, { unique: true });

export default mongoose.model<IHabit>('Habit', HabitSchema);