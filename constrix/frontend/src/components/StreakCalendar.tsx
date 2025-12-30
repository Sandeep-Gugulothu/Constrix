'use client';

import React from 'react';
import { Flame, Check } from 'lucide-react';

interface StreakCalendarProps {
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  checkinDates: Date[];
}

export default function StreakCalendar({ habitName, currentStreak, longestStreak, checkinDates }: StreakCalendarProps) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const checkinSet = new Set(
    checkinDates.map(date => new Date(date).toDateString())
  );
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{habitName}</h3>
          <p className="text-sm text-slate-400">{monthNames[currentMonth]} {currentYear}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1 text-orange-400 mb-1">
              <Flame size={16} />
              <span className="text-2xl font-bold text-white">{currentStreak}</span>
            </div>
            <p className="text-xs text-slate-400">Current</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-1">{longestStreak}</div>
            <p className="text-xs text-slate-400">Best</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 pb-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentYear, currentMonth, day);
          const dateString = date.toDateString();
          const isCheckedIn = checkinSet.has(dateString);
          const isToday = date.toDateString() === today.toDateString();
          const isFuture = date > today;
          
          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                isFuture
                  ? 'bg-slate-800/30 text-slate-600'
                  : isCheckedIn
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
            >
              {isCheckedIn ? <Check size={16} /> : day}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span className="text-slate-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-800 rounded"></div>
            <span className="text-slate-400">Missed</span>
          </div>
        </div>
        <span className="text-slate-500">
          {checkinDates.length} days this month
        </span>
      </div>
    </div>
  );
}
