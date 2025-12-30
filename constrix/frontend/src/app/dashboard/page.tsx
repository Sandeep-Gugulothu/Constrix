'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { HabitCard } from '@/components/HabitCard';
import { isHabitCompletedToday, HABIT_CONFIGS, getHabitConfig } from '@/lib/habitUtils';
import { useHabits, useBlockchain } from '@/hooks/useApi';
import {
  LogOut,
  User,
  Copy,
  Flame,
  Check,
  TrendingUp,
  Clock,
  Zap,
  Lock,
  MessageSquare,
  ArrowRight,
  Dumbbell,
  Code,
  BookOpen,
  DollarSign,
  Grid3X3,
  List,
  GraduationCap,
  Plus,
  AlertCircle
} from 'lucide-react';



const RECENT_SOCIAL = [
  { user: 'alex.eth', action: 'reached 100 days streak!', time: '2m ago' },
  { user: 'sarah_builds', action: 'joined "5 AM Club"', time: '15m ago' },
  { user: 'dao_member', action: 'minted Gold Consistency Badge', time: '1h ago' },
];

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { habits, loading: habitsLoading, error: habitsError, createHabit, checkinHabit } = useHabits();
  const { syncing, syncMilestones } = useBlockchain();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [holdingHabit, setHoldingHabit] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [screenGlow, setScreenGlow] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'dashboard'>('dashboard');
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'7d' | '30d' | '6m' | '1y'>('30d');
  const [celebratingTask, setCelebratingTask] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [completedTaskName, setCompletedTaskName] = useState('');
  const [showCreateHabit, setShowCreateHabit] = useState(false);
  const [creatingHabit, setCreatingHabit] = useState(false);
  // Add missing functions
  const startHold = (habitId: string) => {
    setHoldingHabit(habitId);
  };

  const endHold = () => {
    setHoldingHabit(null);
    setHoldProgress(0);
  };

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Debug logging
  useEffect(() => {
    if (habits && habits.length > 0) {
      console.log('Dashboard Debug:', {
        user: user?.walletAddress,
        habitsLoading,
        habitsError,
        habitsCount: habits?.length,
        habits: habits
      });
    }
  }, [user, habitsLoading, habitsError, habits]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      alert('Address copied!');
    }
  };

  const handleCreateHabit = async (habitType: 'study' | 'fitness') => {
    try {
      setCreatingHabit(true);
      await createHabit(habitType);
      setShowCreateHabit(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setCreatingHabit(false);
    }
  };

  const handleCheckin = async (habitId: string, habitName: string) => {
    try {
      const result = await checkinHabit(habitId);
      
      // Show celebration
      setCelebratingTask(habitId);
      setCompletedTaskName(habitName);
      
      // Show celebration animation for 2 seconds
      setTimeout(() => {
        setCelebratingTask(null);
        if (result.milestone?.achieved) {
          setShowShareModal(true);
        }
      }, 2000);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSyncMilestones = async () => {
    try {
      const result = await syncMilestones();
      alert(`Synced ${result.synced} milestones to blockchain!`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const isHabitCompletedToday = (habit: any) => {
    if (!habit.lastCheckin) return false;
    const today = new Date().toDateString();
    const checkinDate = new Date(habit.lastCheckin).toDateString();
    return today === checkinDate;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-slate-950 transition-all duration-500 ${
      screenGlow === 'red' ? 'bg-red-950/5' :
      screenGlow === 'blue' ? 'bg-blue-950/5' :
      screenGlow === 'emerald' ? 'bg-emerald-950/5' :
      screenGlow === 'amber' ? 'bg-amber-950/5' : ''
    }`}>
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-4 transition-opacity duration-300 ${
            holdingHabit ? 'opacity-30' : 'opacity-100'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold text-white">Constrix</span>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <User size={20} className="text-white" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Connected Wallet</p>
                        <p className="text-slate-400 text-sm">Verychain Network</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-slate-300 text-sm mb-2">Wallet Address</p>
                      <div className="flex items-center space-x-2 bg-slate-900 rounded-lg p-2">
                        <img src="/images/wallet.png" alt="Wallet" className="w-4 h-4" />
                        <span className="text-slate-300 text-sm font-mono flex-1">
                          {user.walletAddress?.slice(0, 8)}...{user.walletAddress?.slice(-8)}
                        </span>
                        <button
                          onClick={copyAddress}
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                        >
                          <Copy size={14} className="text-slate-400" />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome & Quick Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-300 ${
          holdingHabit ? 'opacity-30' : 'opacity-100'
        }`}>
          <div className="md:col-span-2 space-y-3">
            <h1 className="text-4xl font-semibold text-white tracking-tight">
              Good morning, Builder
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">You're on a roll! Maintain your <span className="text-indigo-400 font-medium">Solidity streak</span> to unlock the Week 1 Badge.</p>
          </div>
          
          {/* Login Streak Widget */}
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-400 mb-2">Level Progress</div>
                <div className="text-3xl font-semibold text-white">4<span className="text-slate-500 text-xl font-normal"> Expert</span></div>
                <div className="text-xs text-indigo-400 mt-1">1,420 XP • 580 to Level 5</div>
              </div>
              <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent border-l-transparent" style={{
                  transform: 'rotate(216deg)' // 60% of 360 degrees for visual appeal
                }}></div>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <List size={18} className="text-indigo-400" />
              </div>
              Your Tasks
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowCreateHabit(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
              >
                <Plus size={18} />
                Add Task
              </button>
              <button 
                onClick={() => setShowAllTasks(!showAllTasks)}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-500/10 transition-all"
              >
                {showAllTasks ? 'Show Less' : 'View All'}
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {(habits || []).slice(0, 3).map((habit: any) => {
                const isCompleted = isHabitCompletedToday(habit);
                
                return (
                  <HabitCard
                    key={habit.id || habit._id}
                    habit={{
                      _id: habit.id || habit._id,
                      habitType: habit.type || habit.habitType,
                      currentStreak: habit.currentStreak,
                      longestStreak: habit.longestStreak,
                      lastCheckin: habit.lastCheckin,
                      createdAt: habit.createdAt
                    }}
                    isCompleted={isCompleted}
                    onComplete={handleCheckin}
                    onClick={(habitId) => router.push(`/habits/${habitId}`)}
                  />
                );
              })}
            </div>
            
            {/* Additional Tasks Row */}
            {showAllTasks && (
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-700/50">
                {(habits || []).slice(3).map((habit: any) => {
                  const config = getHabitConfig(habit.type || habit.habitType);
                  const IconComponent = config.icon;
                  const streakProgress = (habit.currentStreak / 30) * 100;
                  const isCompleted = isHabitCompletedToday(habit);
                  
                  return (
                    <div 
                      key={habit.id || habit._id} 
                      className="flex flex-col items-center group cursor-pointer"
                      onClick={() => router.push(`/habits/${habit.id || habit._id}`)}
                    >
                      <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-2xl bg-slate-800/80 border-2 border-slate-700/50 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-black/20">
                          <IconComponent size={36} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="44"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-slate-700/50"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="44"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 44}`}
                            strokeDashoffset={`${2 * Math.PI * 44 * (1 - streakProgress / 100)}`}
                            className={isCompleted ? "text-emerald-400" : "text-orange-400"}
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        {/* Completion Indicator */}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h4 className="text-white font-semibold text-sm mb-2 group-hover:text-indigo-400 transition-colors">
                          {config.name}
                        </h4>
                        <p className="text-slate-400 text-xs mb-3 flex items-center justify-center gap-1">
                          <Flame size={12} className="text-orange-400" />
                          {habit.currentStreak || 0} day streak
                        </p>
                        {!isCompleted && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckin(habit.id || habit._id, config.name);
                            }}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-medium hover:bg-indigo-400 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:scale-105"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Conditional View Rendering */}
        {viewMode === 'grid' && habits && (
          /* Big Icon Grid View */
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {habits.map((habit: any) => {
                const config = getHabitConfig(habit.type || habit.habitType);
                const IconComponent = config.icon;
                const isCompleted = isHabitCompletedToday(habit);
                const progressPercent = isCompleted ? 100 : 50; // Simplified progress
                const isHolding = holdingHabit === (habit.id || habit._id);
                const currentProgress = isHolding ? holdProgress : progressPercent;
                
                return (
                  <div key={habit.id || habit._id} className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <button
                        disabled={isCompleted}
                        onClick={() => router.push(`/habits/${habit.id || habit._id}`)}
                        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 transform ${
                          isCompleted 
                            ? `${config.bgColor} shadow-2xl ${config.glowColor} scale-110` 
                            : 'bg-slate-800 hover:bg-slate-700 active:scale-95'
                        } ${isHolding ? 'scale-110' : ''}`}
                      >
                        <IconComponent 
                          size={32} 
                          className={isCompleted ? 'text-white' : 'text-slate-300'} 
                        />
                        
                        {/* Circular Progress Ring */}
                        <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-slate-700"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - currentProgress / 100)}`}
                            className={`transition-all duration-75 ${
                              isCompleted 
                                ? 'text-white' 
                                : config.color === 'red' ? 'text-red-500' :
                                  config.color === 'blue' ? 'text-blue-500' :
                                  config.color === 'emerald' ? 'text-emerald-500' :
                                  config.color === 'amber' ? 'text-amber-500' :
                                  'text-slate-500'
                            }`}
                          />
                        </svg>
                        
                        {isCompleted && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check size={20} className="text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                    
                    <div className={`text-center transition-opacity duration-200 ${
                      holdingHabit && holdingHabit !== (habit.id || habit._id) ? 'opacity-30' : 'opacity-100'
                    }`}>
                      <h3 className="text-white font-medium text-sm">{config.name}</h3>
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-1">
                        <Flame size={12} className="text-orange-400" />
                        <span>{habit.currentStreak || 0}d</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Activity Heatmap with Sidebar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: Activity Heatmap */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
                    Activity Overview
                  </h3>
                  <select 
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value as '7d' | '30d' | '6m' | '1y')}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="7d">Past 7 days</option>
                    <option value="30d">Past 30 days</option>
                    <option value="6m">Past 6 months</option>
                    <option value="1y">Past year</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-1 overflow-x-auto">
                    {timePeriod === '7d' ? (
                      // 7 days - single row
                      <div className="flex gap-1">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const hasActivity = Math.random() > 0.25;
                          const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
                          const intensityClass = 
                            intensity === 0 ? 'bg-slate-800' :
                            intensity === 1 ? 'bg-emerald-900/60' :
                            intensity === 2 ? 'bg-emerald-700/80' :
                            intensity === 3 ? 'bg-emerald-500' :
                            'bg-emerald-400';
                          
                          return (
                            <div
                              key={dayIndex}
                              className={`w-2.5 h-2.5 rounded-sm ${intensityClass} hover:ring-1 hover:ring-emerald-400/50 transition-all cursor-pointer`}
                              title={`${hasActivity ? `${intensity} task${intensity > 1 ? 's' : ''} completed` : 'No activity'}`}
                            />
                          );
                        })}
                      </div>
                    ) : timePeriod === '30d' ? (
                      // 30 days - ~4-5 weeks
                      Array.from({ length: 5 }, (_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }, (_, dayIndex) => {
                            const hasActivity = Math.random() > 0.25;
                            const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
                            const intensityClass = 
                              intensity === 0 ? 'bg-slate-800' :
                              intensity === 1 ? 'bg-emerald-900/60' :
                              intensity === 2 ? 'bg-emerald-700/80' :
                              intensity === 3 ? 'bg-emerald-500' :
                              'bg-emerald-400';
                            
                            return (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`w-2.5 h-2.5 rounded-sm ${intensityClass} hover:ring-1 hover:ring-emerald-400/50 transition-all cursor-pointer`}
                                title={`${hasActivity ? `${intensity} task${intensity > 1 ? 's' : ''} completed` : 'No activity'}`}
                              />
                            );
                          })}
                        </div>
                      ))
                    ) : timePeriod === '6m' ? (
                      // 6 months - ~26 weeks
                      Array.from({ length: 26 }, (_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }, (_, dayIndex) => {
                            const hasActivity = Math.random() > 0.25;
                            const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
                            const intensityClass = 
                              intensity === 0 ? 'bg-slate-800' :
                              intensity === 1 ? 'bg-emerald-900/60' :
                              intensity === 2 ? 'bg-emerald-700/80' :
                              intensity === 3 ? 'bg-emerald-500' :
                              'bg-emerald-400';
                            
                            return (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`w-2.5 h-2.5 rounded-sm ${intensityClass} hover:ring-1 hover:ring-emerald-400/50 transition-all cursor-pointer`}
                                title={`${hasActivity ? `${intensity} task${intensity > 1 ? 's' : ''} completed` : 'No activity'}`}
                              />
                            );
                          })}
                        </div>
                      ))
                    ) : (
                      // 1 year - 53 weeks
                      Array.from({ length: 53 }, (_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }, (_, dayIndex) => {
                            const hasActivity = Math.random() > 0.25;
                            const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
                            const intensityClass = 
                              intensity === 0 ? 'bg-slate-800' :
                              intensity === 1 ? 'bg-emerald-900/60' :
                              intensity === 2 ? 'bg-emerald-700/80' :
                              intensity === 3 ? 'bg-emerald-500' :
                              'bg-emerald-400';
                            
                            return (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`w-2.5 h-2.5 rounded-sm ${intensityClass} hover:ring-1 hover:ring-emerald-400/50 transition-all cursor-pointer`}
                                title={`${hasActivity ? `${intensity} task${intensity > 1 ? 's' : ''} completed` : 'No activity'}`}
                              />
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-slate-800 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-emerald-900/60 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-emerald-700/80 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm"></div>
                      </div>
                      <span>More</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {timePeriod === '7d' ? 'Last 7 days' :
                       timePeriod === '30d' ? 'Last 30 days' :
                       timePeriod === '6m' ? 'Last 6 months' :
                       'Last 12 months'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* VERY Ads - Under Heatmap */}
              <div className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <img src="/images/veryads.png" alt="VERY" className="w-50 h-5" />
                    </h3>
                    <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-1 rounded-full">
                      Ad
                    </span>
                  </div>
                  
                  <div className="text-sm text-white font-medium mb-2">
                    Earn More $VERY Tokens
                  </div>
                  <div className="text-xs text-violet-200 mb-4">
                    Join VeryChat Premium and get 2x rewards on all completed tasks
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-white/5 mb-4">
                    <div className="h-8 w-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">2x</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white font-medium">Premium Benefits</div>
                      <div className="text-xs text-violet-200">Double rewards + exclusive badges</div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-bold rounded-lg transition-all hover:scale-105">
                    Upgrade Now
                  </button>
                </div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-violet-500/30 blur-2xl rounded-full pointer-events-none" />
              </div>
            </div>
            
            {/* RIGHT: Sidebar Widgets */}
            <div className="space-y-6">
              
              {/* Daily Challenge */}
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" />
                    Today's Challenge
                  </h3>
                  <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                    +100 VERY
                  </span>
                </div>
                
                <div className="text-sm text-slate-300 mb-4">
                  Complete all 3 main tasks before 6 PM
                </div>
                
                {/* Challenge Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                    <span className="text-slate-300">Attend Classes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-slate-700 rounded-full border border-slate-600"></div>
                    <span className="text-slate-500">Fitness</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-slate-700 rounded-full border border-slate-600"></div>
                    <span className="text-slate-500">Study</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>Progress: 1/3 tasks</span>
                  <span>4h 23m left</span>
                </div>
                
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500" style={{width: '33%'}}></div>
                </div>
              </div>

              {/* Progress Rewards Widget */}
              <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-indigo-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">!</span>
                    </div>
                    Next Milestone
                  </h3>
                  
                  {/* Progress to next reward */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-indigo-200 mb-2">
                      <span>7-day streak progress</span>
                      <span>5/7 days</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-indigo-400 to-violet-400 h-2 rounded-full transition-all duration-500" style={{width: '71%'}}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-white/5 mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">7</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Week Warrior</div>
                      <div className="text-xs text-indigo-200">Complete 2 more daily tasks</div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold rounded-lg transition-colors">
                    View Progress
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/30 blur-2xl rounded-full pointer-events-none" />
              </div>

            </div>
          </div>
          
          {/* Friends Activity - Below Heatmap */}
          <div className="mt-6">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <img src="/images/community.png" alt="Community" className="w-[26px] h-[24px] object-contain" />
                  Friends Activity
                </h3>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  3 online
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex gap-3 items-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                    AX
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">Alex</div>
                    <div className="text-xs text-slate-400">12-day streak • Fitness</div>
                  </div>
                  <div className="text-emerald-400">
                    <Check size={16} />
                  </div>
                </div>
                
                <div className="flex gap-3 items-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    SM
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">Sarah</div>
                    <div className="text-xs text-slate-400">5-day streak • Study</div>
                  </div>
                  <div className="text-orange-400">
                    <Flame size={16} />
                  </div>
                </div>
                
                <div className="flex gap-3 items-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">Jordan</div>
                    <div className="text-xs text-slate-400">Just started • Classes</div>
                  </div>
                  <div className="text-slate-500">
                    <Clock size={16} />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => router.push('/social')}
                  className="px-6 py-2 border border-white/10 hover:bg-white/5 text-slate-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >                  Open Social Hub
                </button>
              </div>
            </div>
          </div>
          
          {/* Analytics & Insights */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Weekly Stats */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-400" />
                  Weekly Stats
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">18</div>
                    <div className="text-xs text-slate-400">Tasks Completed</div>
                  </div>
                  <div className="text-emerald-400 text-sm font-medium">+12%</div>
                </div>
                
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-white">{(habits || []).filter(h => h.currentStreak > 0).length}</div>
                    <div className="text-xs text-slate-400">Active Streaks</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-white">{habits && habits.length > 0 ? Math.round(((habits || []).filter(h => isHabitCompletedToday(h)).length / habits.length) * 100) : 0}%</div>
                    <div className="text-xs text-slate-400">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* $VERY Earnings */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <img src="/images/wallet.png" alt="Wallet" className="w-5 h-5" />
                  $VERY Earned
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">1,247</div>
                  <div className="text-xs text-amber-200">This Month</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Daily Tasks</span>
                    <span className="text-white font-medium">+850</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Streaks Bonus</span>
                    <span className="text-white font-medium">+297</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Challenges</span>
                    <span className="text-white font-medium">+100</span>
                  </div>
                </div>
                
                <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-lg hover:scale-105 transition-all">
                  Claim Rewards
                </button>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  Achievements
                </h3>
                <button 
                  onClick={() => router.push('/achievements')}
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Flame size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Week Warrior</div>
                    <div className="text-xs text-emerald-400">7-day streak achieved!</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Early Bird</div>
                    <div className="text-xs text-blue-400">Complete before 8 AM</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg opacity-50">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Lock size={20} className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-400">Fortnight Focus</div>
                    <div className="text-xs text-slate-500">2 days to unlock</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
      {/* Professional Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800/50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-white">Constrix</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                The habit layer for the new internet.
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Habits</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Analytics</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Rewards</a></li>
              </ul>
            </div>
            
            {/* Community Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">VeryChat</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Discord</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Twitter</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-slate-800/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 Constrix. Built on VeryChain Network.
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-slate-400 text-sm">Powered by VeryChain</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Celebration Animation */}
      {celebratingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Check size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Task Completed!
            </h2>
            <p className="text-xl text-slate-300">
              {completedTaskName} marked as done
            </p>
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Create Habit Modal */}
      {showCreateHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Create New Habit
            </h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleCreateHabit('study')}
                disabled={creatingHabit}
                className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                  <BookOpen size={24} className="text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">Study Habit</div>
                  <div className="text-slate-400 text-sm">Track your learning progress</div>
                </div>
              </button>
              
              <button 
                onClick={() => handleCreateHabit('fitness')}
                disabled={creatingHabit}
                className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-all">
                  <Dumbbell size={24} className="text-red-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">Fitness Habit</div>
                  <div className="text-slate-400 text-sm">Stay active and healthy</div>
                </div>
              </button>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setShowCreateHabit(false)}
                disabled={creatingHabit}
                className="flex-1 py-2 border border-slate-600 text-slate-400 rounded-xl hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Share Your Achievement!
            </h3>
            <p className="text-slate-400 text-center mb-6">
              Let your friends know about your progress with {completedTaskName}
            </p>
            
            <div className="space-y-4">
              <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-xl font-medium hover:scale-105 transition-all flex items-center justify-center gap-2">
                Share to
                <img src="/images/image.png" alt="VeryChat" className="w-30 h-6 object-contain" />
                
              </button>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:scale-105 transition-all flex items-center justify-center gap-2">
                Share to 
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                
              </button>
              <button className="w-full py-3 bg-slate-700 text-white rounded-xl font-medium hover:scale-105 transition-all flex items-center justify-center gap-2">
                <Copy size={20} />
                Copy Link
              </button>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-2 border border-slate-600 text-slate-400 rounded-xl hover:bg-slate-800 transition-all"
              >
                Maybe Later
              </button>
              <button 
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}