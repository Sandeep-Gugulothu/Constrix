'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Flame, Trophy, Zap, Clock } from 'lucide-react';

interface SocialPost {
  id: string;
  user: {
    username: string;
    avatar: string;
    walletAddress: string;
  };
  type: 'milestone' | 'streak' | 'challenge' | 'achievement';
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  metadata?: {
    habitName?: string;
    streakDays?: number;
    badgeName?: string;
    challengeName?: string;
  };
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    user: { username: 'alex.eth', avatar: 'AX', walletAddress: '0x1234...5678' },
    type: 'milestone',
    content: 'Just hit my 30-day streak in Solidity study! 🔥 The consistency is paying off - deployed my first DeFi protocol today!',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    isLiked: false,
    metadata: { habitName: 'Study Solidity', streakDays: 30 }
  },
  {
    id: '2',
    user: { username: 'sarah_builds', avatar: 'SB', walletAddress: '0x2345...6789' },
    type: 'achievement',
    content: 'Earned the "Early Bird" badge! 🌅 There\'s something magical about coding at 6 AM when the world is quiet.',
    timestamp: '4 hours ago',
    likes: 18,
    comments: 5,
    isLiked: true,
    metadata: { badgeName: 'Early Bird' }
  },
  {
    id: '3',
    user: { username: 'crypto_dev', avatar: 'CD', walletAddress: '0x3456...7890' },
    type: 'challenge',
    content: 'Started the "100 Days of Code" challenge! Who wants to join me? Let\'s build the future together 💪',
    timestamp: '6 hours ago',
    likes: 31,
    comments: 12,
    isLiked: false,
    metadata: { challengeName: '100 Days of Code' }
  },
  {
    id: '4',
    user: { username: 'habit_master', avatar: 'HM', walletAddress: '0x5678...9012' },
    type: 'streak',
    content: 'Week 3 of daily fitness complete! 💪 Combining physical and mental strength for better coding sessions.',
    timestamp: '8 hours ago',
    likes: 15,
    comments: 3,
    isLiked: false,
    metadata: { habitName: 'Daily Fitness', streakDays: 21 }
  },
  {
    id: '5',
    user: { username: 'daily_grind', avatar: 'DG', walletAddress: '0x6789...0123' },
    type: 'milestone',
    content: 'Minted my first Consistency NFT! 🎉 This 14-day study streak badge will forever be on-chain.',
    timestamp: '12 hours ago',
    likes: 42,
    comments: 15,
    isLiked: true,
    metadata: { habitName: 'Study', streakDays: 14 }
  }
];

export default function SocialFeed() {
  const [posts, setPosts] = useState(mockPosts);
  const [filter, setFilter] = useState<'all' | 'following' | 'trending'>('all');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Trophy className="text-yellow-400" size={16} />;
      case 'streak': return <Flame className="text-orange-400" size={16} />;
      case 'challenge': return <Zap className="text-purple-400" size={16} />;
      case 'achievement': return <Trophy className="text-emerald-400" size={16} />;
      default: return <Clock className="text-slate-400" size={16} />;
    }
  };

  const getPostBadge = (type: string) => {
    switch (type) {
      case 'milestone': return 'Milestone';
      case 'streak': return 'Streak';
      case 'challenge': return 'Challenge';
      case 'achievement': return 'Achievement';
      default: return 'Update';
    }
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Community Feed</h3>
          <p className="text-sm text-slate-400">See what others are achieving</p>
        </div>
        
        <div className="flex gap-2">
          {['all', 'following', 'trending'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                filter === filterType
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                {post.user.avatar}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">{post.user.username}</span>
                  <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-full">
                    {getPostIcon(post.type)}
                    <span className="text-xs text-slate-300">{getPostBadge(post.type)}</span>
                  </div>
                  <span className="text-xs text-slate-500">{post.timestamp}</span>
                </div>
                
                <p className="text-slate-300 text-sm mb-3 leading-relaxed">{post.content}</p>
                
                {post.metadata && (
                  <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
                    {post.metadata.habitName && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Habit:</span>
                        <span className="text-white font-medium">{post.metadata.habitName}</span>
                        {post.metadata.streakDays && (
                          <>
                            <span className="text-slate-500">•</span>
                            <div className="flex items-center gap-1 text-orange-400">
                              <Flame size={14} />
                              <span>{post.metadata.streakDays} days</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {post.metadata.badgeName && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Badge:</span>
                        <span className="text-emerald-400 font-medium">{post.metadata.badgeName}</span>
                      </div>
                    )}
                    {post.metadata.challengeName && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Challenge:</span>
                        <span className="text-purple-400 font-medium">{post.metadata.challengeName}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm transition-all hover:scale-105 ${
                      post.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                    }`}
                  >
                    <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400 transition-all hover:scale-105">
                    <MessageCircle size={16} />
                    <span>{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-green-400 transition-all hover:scale-105">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <button className="w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium hover:bg-indigo-500/10 rounded-lg transition-all">
          Load More Posts
        </button>
      </div>
    </div>
  );
}