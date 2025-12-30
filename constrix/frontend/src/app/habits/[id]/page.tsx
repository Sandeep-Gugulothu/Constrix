'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Flame, Target, Calendar, BarChart3, Share2, Settings, Trash2 } from 'lucide-react';
import StreakCalendar from '@/components/StreakCalendar';
import ProgressChart from '@/components/ProgressChart';
import { useHabits } from '@/hooks/useApi';
import { getHabitConfig } from '@/lib/habitUtils';

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'analytics'>('overview');
  const { habits, loading } = useHabits();
  
  // Find the actual habit from the API data
  const habit = habits?.find(h => ((h as any).id || (h as any)._id) === params.id);
  const config = habit ? getHabitConfig((habit as any).type || (habit as any).habitType) : null;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!habit || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400">Habit not found</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const weeklyData = [
    { label: 'Mon', value: 1, change: 0 },
    { label: 'Tue', value: 1, change: 0 },
    { label: 'Wed', value: 0, change: -100 },
    { label: 'Thu', value: 1, change: 100 },
    { label: 'Fri', value: 1, change: 0 },
    { label: 'Sat', value: 1, change: 0 },
    { label: 'Sun', value: 1, change: 0 },
  ];
  
  const monthlyData = [
    { label: 'Week 1', value: 6, change: 20 },
    { label: 'Week 2', value: 7, change: 17 },
    { label: 'Week 3', value: 5, change: -29 },
    { label: 'Week 4', value: 6, change: 20 },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{config.name}</h1>
                <p className="text-sm text-slate-400">{config.name} habit tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Share2 size={20} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings size={20} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Flame size={20} className="text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{habit.currentStreak || 0}</div>
                <div className="text-sm text-slate-400">Current Streak</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Target size={20} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{habit.longestStreak || 0}</div>
                <div className="text-sm text-slate-400">Best Streak</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Math.floor((new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24))}</div>
                <div className="text-sm text-slate-400">Total Days</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 size={20} className="text-violet-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{habit.currentStreak > 0 ? Math.round((habit.currentStreak / Math.max(1, Math.floor((new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)))) * 100) : 0}%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProgressChart
                title="This Week"
                data={weeklyData}
                timeframe="Week"
              />
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Milestones</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">7</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Week Warrior</div>
                      <div className="text-xs text-slate-400">Achieved 3 days ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg opacity-60">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-slate-400 font-bold text-sm">14</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-400">Fortnight Focus</div>
                      <div className="text-xs text-slate-500">2 days to go</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <ProgressChart
                title="This Month"
                data={monthlyData}
                timeframe="Month"
              />
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Habit Insights</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Best day</span>
                    <span className="text-sm font-medium text-white">Tuesday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Avg. session time</span>
                    <span className="text-sm font-medium text-white">45 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Most productive time</span>
                    <span className="text-sm font-medium text-white">9:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Consistency score</span>
                    <span className="text-sm font-medium text-emerald-400">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'calendar' && (
          <div className="max-w-2xl mx-auto">
            <StreakCalendar
              habitName={config.name}
              currentStreak={habit.currentStreak || 0}
              longestStreak={habit.longestStreak || 0}
              checkinDates={[]}
            />
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProgressChart
              title="Weekly Performance"
              data={weeklyData}
              timeframe="Week"
            />
            <ProgressChart
              title="Monthly Trends"
              data={monthlyData}
              timeframe="Month"
            />
            
            <div className="lg:col-span-2">
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Performance Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">87%</div>
                    <div className="text-sm text-slate-400">Success Rate</div>
                    <div className="text-xs text-emerald-400 mt-1">+5% vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-400 mb-2">12</div>
                    <div className="text-sm text-slate-400">Current Streak</div>
                    <div className="text-xs text-indigo-400 mt-1">Personal best: 18</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-violet-400 mb-2">45</div>
                    <div className="text-sm text-slate-400">Total Days</div>
                    <div className="text-xs text-violet-400 mt-1">Since Nov 1st</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}