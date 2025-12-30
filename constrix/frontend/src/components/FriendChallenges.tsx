'use client';

import React, { useState } from 'react';
import { Users, Plus, Clock, Trophy, Target, Flame, Crown, Swords } from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'completion' | 'consistency';
  duration: string;
  participants: {
    username: string;
    avatar: string;
    progress: number;
    rank: number;
  }[];
  prize: string;
  status: 'active' | 'upcoming' | 'completed';
  timeLeft: string;
  isJoined: boolean;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: '7-Day Coding Sprint',
    description: 'Code for at least 1 hour daily for 7 consecutive days',
    type: 'streak',
    duration: '7 days',
    participants: [
      { username: 'alex.eth', avatar: 'AX', progress: 85, rank: 1 },
      { username: 'you', avatar: 'YU', progress: 71, rank: 2 },
      { username: 'sarah_builds', avatar: 'SB', progress: 57, rank: 3 },
      { username: 'crypto_dev', avatar: 'CD', progress: 42, rank: 4 },
    ],
    prize: '500 $VERY + Exclusive NFT',
    status: 'active',
    timeLeft: '2 days left',
    isJoined: true
  },
  {
    id: '2',
    name: 'Fitness February',
    description: 'Complete 20 workout sessions this month',
    type: 'completion',
    duration: '30 days',
    participants: [
      { username: 'habit_master', avatar: 'HM', progress: 90, rank: 1 },
      { username: 'daily_grind', avatar: 'DG', progress: 75, rank: 2 },
      { username: 'streak_king', avatar: 'SK', progress: 60, rank: 3 },
    ],
    prize: '1000 $VERY + Fitness Badge',
    status: 'active',
    timeLeft: '12 days left',
    isJoined: false
  },
  {
    id: '3',
    name: 'Study Streak Masters',
    description: 'Maintain perfect study consistency for 14 days',
    type: 'consistency',
    duration: '14 days',
    participants: [
      { username: 'consistency_queen', avatar: 'CQ', progress: 100, rank: 1 },
      { username: 'alex.eth', avatar: 'AX', progress: 92, rank: 2 },
      { username: 'you', avatar: 'YU', progress: 85, rank: 3 },
    ],
    prize: '750 $VERY + Study Master NFT',
    status: 'completed',
    timeLeft: 'Completed',
    isJoined: true
  },
  {
    id: '4',
    name: 'March Madness Habits',
    description: 'Complete all daily habits for 31 days straight',
    type: 'streak',
    duration: '31 days',
    participants: [],
    prize: '2000 $VERY + Champion Badge',
    status: 'upcoming',
    timeLeft: 'Starts in 5 days',
    isJoined: false
  }
];

export default function FriendChallenges() {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const joinChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge => 
      challenge.id === challengeId 
        ? { 
            ...challenge, 
            isJoined: true,
            participants: [...challenge.participants, {
              username: 'you',
              avatar: 'YU',
              progress: 0,
              rank: challenge.participants.length + 1
            }]
          }
        : challenge
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10';
      case 'upcoming': return 'text-blue-400 bg-blue-400/10';
      case 'completed': return 'text-slate-400 bg-slate-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className="text-orange-400" size={16} />;
      case 'completion': return <Target className="text-blue-400" size={16} />;
      case 'consistency': return <Trophy className="text-yellow-400" size={16} />;
      default: return <Users className="text-slate-400" size={16} />;
    }
  };

  const filteredChallenges = challenges.filter(challenge => challenge.status === activeTab);

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Swords size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Challenges</h3>
            <p className="text-sm text-slate-400">Compete with friends</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg font-medium transition-all hover:scale-105"
        >
          <Plus size={16} />
          Create
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg mb-6">
        {['active', 'upcoming', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all ${
              activeTab === tab
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredChallenges.map((challenge) => (
          <div key={challenge.id} className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white">{challenge.name}</h4>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(challenge.type)}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(challenge.status)}`}>
                    {challenge.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{challenge.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{challenge.timeLeft}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{challenge.participants.length} participants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy size={12} />
                    <span>{challenge.prize}</span>
                  </div>
                </div>
              </div>
              
              {!challenge.isJoined && challenge.status !== 'completed' && (
                <button 
                  onClick={() => joinChallenge(challenge.id)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-sm font-medium transition-all hover:scale-105"
                >
                  Join
                </button>
              )}
            </div>

            {challenge.participants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Leaderboard</span>
                  {challenge.isJoined && (
                    <span className="text-xs text-indigo-400">You're participating</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {challenge.participants.slice(0, 3).map((participant, index) => (
                    <div key={participant.username} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6">
                        {participant.rank === 1 ? (
                          <Crown className="text-yellow-400" size={16} />
                        ) : (
                          <span className="text-slate-400 text-sm font-bold">#{participant.rank}</span>
                        )}
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                        {participant.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            participant.username === 'you' ? 'text-indigo-400' : 'text-white'
                          }`}>
                            {participant.username}
                            {participant.username === 'you' && (
                              <span className="text-xs text-indigo-400 ml-1">(You)</span>
                            )}
                          </span>
                          <span className="text-sm font-bold text-white">{participant.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${participant.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {challenge.participants.length > 3 && (
                    <div className="text-center">
                      <button className="text-xs text-slate-400 hover:text-white">
                        +{challenge.participants.length - 3} more participants
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Swords size={24} className="text-slate-500" />
          </div>
          <p className="text-slate-400 mb-2">No {activeTab} challenges</p>
          <p className="text-sm text-slate-500">Create one to get started!</p>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create Challenge</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Challenge Name</label>
                <input 
                  type="text" 
                  placeholder="30-Day Coding Challenge"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  placeholder="Code for at least 1 hour every day..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 h-20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                    <option value="streak">Streak</option>
                    <option value="completion">Completion</option>
                    <option value="consistency">Consistency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 border border-slate-600 text-slate-400 rounded-lg hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-all"
              >
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}