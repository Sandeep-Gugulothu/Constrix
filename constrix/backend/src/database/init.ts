import mongoose from 'mongoose';
import User from '../models/User';
import Habit from '../models/Habit';
import Checkin from '../models/Checkin';
import Milestone from '../models/Milestone';

export async function initializeDatabase() {
  try {
    // Create indexes
    await Promise.all([
      User.createIndexes(),
      Habit.createIndexes(),
      Checkin.createIndexes(),
      Milestone.createIndexes()
    ]);
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}
