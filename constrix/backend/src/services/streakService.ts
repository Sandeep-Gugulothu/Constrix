import Checkin from '../models/Checkin';
import Habit from '../models/Habit';

export class StreakService {
  static async calculateStreak(habitId: string) {
    try {
      const habit = await Habit.findById(habitId);
      if (!habit) {
        throw new Error('Habit not found');
      }

      const checkins = await Checkin.find({ habitId })
        .sort({ checkinDate: -1 })
        .limit(365); // Only check last year for performance

      if (checkins.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastCheckinDate: null,
          isActive: false
        };
      }

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if there's a checkin today or yesterday
      const latestCheckin = checkins[0];
      const latestDate = new Date(latestCheckin.checkinDate);
      latestDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) { // Today or yesterday
        currentStreak = 1;
        
        // Count consecutive days backwards
        for (let i = 1; i < checkins.length; i++) {
          const currentDate = new Date(checkins[i-1].checkinDate);
          const prevDate = new Date(checkins[i].checkinDate);
          currentDate.setHours(0, 0, 0, 0);
          prevDate.setHours(0, 0, 0, 0);
          
          const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 1;

      for (let i = 1; i < checkins.length; i++) {
        const currentDate = new Date(checkins[i-1].checkinDate);
        const prevDate = new Date(checkins[i].checkinDate);
        currentDate.setHours(0, 0, 0, 0);
        prevDate.setHours(0, 0, 0, 0);
        
        const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        currentStreak,
        longestStreak,
        lastCheckinDate: latestCheckin.checkinDate.toISOString().split('T')[0],
        isActive: currentStreak > 0
      };
    } catch (error) {
      console.error('Error calculating streak:', error);
      throw error;
    }
  }

  static async updateHabitStreak(habitId: string) {
    try {
      const streakData = await this.calculateStreak(habitId);
      
      await Habit.findByIdAndUpdate(habitId, {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastCheckin: streakData.lastCheckinDate ? new Date(streakData.lastCheckinDate) : undefined
      });

      return streakData;
    } catch (error) {
      console.error('Error updating habit streak:', error);
      throw error;
    }
  }
}