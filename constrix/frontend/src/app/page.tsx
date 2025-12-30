'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WalletSelectionModal, WalletType } from '@/components/WalletSelectionModal';

const useCountUp = (end: number, duration: number = 2000, isVisible: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);
  
  return count;
};

const useIntersectionObserver = (ref: React.RefObject<Element>) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  
  return isVisible;
};
import { 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Wallet, 
  Activity, 
  Lock,
  Heart,
  BookOpen,
  Target
} from 'lucide-react';

const Navbar = ({ onConnectWallet, isConnecting }: { onConnectWallet: () => void; isConnecting: boolean }) => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Constrix
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
      </div>

      <button 
        onClick={onConnectWallet}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all text-sm font-medium text-white disabled:opacity-50"
      >
        <Wallet size={16} />
        <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
      </button>
    </div>
  </nav>
);

const Hero = ({ onConnectWallet, isConnecting }: { onConnectWallet: () => void; isConnecting: boolean }) => {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isStatsVisible = useIntersectionObserver(statsRef);
  
  const activeStreaks = useCountUp(12403, 2000, isStatsVisible);
  const veryEarned = useCountUp(1200000, 2500, isStatsVisible);
  const completionRate = useCountUp(94, 1500, isStatsVisible);
  const nftsMinted = useCountUp(8500, 2200, isStatsVisible);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleJoinHabitRoom = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'intent://verychat#Intent;scheme=verychat;package=com.add.verychat_app;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.add.verychat_app&hl=en-US&pli=1;end';
    } else {
      window.open('https://play.google.com/store/apps/details?id=com.add.verychat_app&hl=en-US&pli=1', '_blank');
    }
  };

  return (
  <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden perspective-1000">
    <div 
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 transition-transform duration-1000 ease-out"
      style={{
        transform: `translate(-50%, ${mousePos.y * 0.02}px) rotateX(${mousePos.y * 0.01}deg) rotateY(${mousePos.x * 0.01}deg)`
      }}
    />
    <div 
      className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] -z-10 transition-transform duration-1000 ease-out"
      style={{
        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * -0.02}px) rotateX(${mousePos.y * -0.01}deg) rotateY(${mousePos.x * -0.01}deg)`
      }}
    />

    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8 scroll-animate transform-gpu hover:scale-105 transition-all duration-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Live on Verychain mainnet
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 scroll-animate transform-gpu hover:scale-105 transition-all duration-500">
        Build Habits That <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 animate-gradient-x">
          Follow You Everywhere
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed scroll-animate">
        The on-chain habit layer. Turn daily consistency into immutable streaks, 
        portable reputation NFTs, and real rewards.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 scroll-animate">
        <button 
          onClick={onConnectWallet}
          disabled={isConnecting}
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform-gpu hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
        >
          {isConnecting ? 'Connecting Wallet...' : 'Start Your Streak'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={handleJoinHabitRoom}
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 border border-slate-700 transition-all transform-gpu hover:scale-105 hover:shadow-xl hover:shadow-slate-700/50 flex items-center justify-center gap-2"
        >
           Join Habit Room
          <img src="/images/image.png" alt="VeryChat" className="w-50 h-5" />
         
        </button>
      </div>

      <div ref={statsRef} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/5 pt-8 scroll-animate">
        <div className="text-center transform-gpu hover:scale-110 transition-all duration-300 hover:bg-white/5 rounded-xl p-4 cursor-pointer">
          <div className="text-2xl font-bold text-white">{activeStreaks.toLocaleString()}</div>
          <div className="text-sm text-slate-500">Active Streaks</div>
        </div>
        <div className="text-center transform-gpu hover:scale-110 transition-all duration-300 hover:bg-white/5 rounded-xl p-4 cursor-pointer">
          <div className="text-2xl font-bold text-white">{veryEarned > 1000000 ? `${(veryEarned/1000000).toFixed(1)}M+` : veryEarned.toLocaleString()}</div>
          <div className="text-sm text-slate-500">VERY Earned</div>
        </div>
        <div className="text-center transform-gpu hover:scale-110 transition-all duration-300 hover:bg-white/5 rounded-xl p-4 cursor-pointer">
          <div className="text-2xl font-bold text-white">{completionRate}%</div>
          <div className="text-sm text-slate-500">Completion Rate</div>
        </div>
        <div className="text-center transform-gpu hover:scale-110 transition-all duration-300 hover:bg-white/5 rounded-xl p-4 cursor-pointer">
          <div className="text-2xl font-bold text-white">{nftsMinted > 1000 ? `${(nftsMinted/1000).toFixed(1)}k` : nftsMinted.toLocaleString()}</div>
          <div className="text-sm text-slate-500">NFTs Minted</div>
        </div>
      </div>
    </div>
  </section>
  );
};

const FeatureBento = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
  <section id="features" className="py-24 bg-slate-950 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16 scroll-animate">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transform-gpu hover:scale-105 transition-all duration-300">Why Move Habits On-Chain?</h2>
        <p className="text-slate-400">Web2 apps trap your data. Constrix makes it yours forever.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="md:col-span-2 p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden transform-gpu hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 0 ? 'rotateX(5deg) rotateY(-5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative z-10">
            <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-6 transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Immutable Streaks</h3>
            <p className="text-slate-400 max-w-md">
              Your history is anchored on Verychain. No app update, server crash, or company shutdown can erase your 100-day hard work.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-indigo-600/20 to-transparent opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
        </div>

        <div 
          className="md:row-span-2 p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-violet-500/30 transition-all group transform-gpu hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 1 ? 'rotateX(-5deg) rotateY(5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-6 transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Trophy size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Portable Reputation</h3>
          <p className="text-slate-400 mb-8">
            Earn Soulbound NFTs for milestones. Use your fitness streak to unlock lower insurance rates or access exclusive communities in the Very ecosystem.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5 transform-gpu group-hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 animate-pulse" />
              <div>
                <div className="text-sm font-bold text-white">Fitness Badge</div>
                <div className="text-xs text-slate-500">Lv. 10 • 100 Days</div>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div 
          className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-pink-500/30 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 2 ? 'rotateX(5deg) rotateY(5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 mb-6 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-300">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Social Proof</h3>
          <p className="text-slate-400 text-sm">
            Integrated with Verychat. Your friends witness your check-ins, making cheating socially expensive.
          </p>
        </div>

        <div 
          className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 3 ? 'rotateX(-5deg) rotateY(-5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-300">
            <Activity size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Proof of Action</h3>
          <p className="text-slate-400 text-sm">
            Sync Apple Health, Google Fit, or Focus Timers. Real data verifies real effort.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};

const UseCases = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
  <section className="py-24 bg-slate-900 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-emerald-500/5" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16 scroll-animate">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transform-gpu hover:scale-105 transition-all duration-300">Transform Every Area of Your Life</h2>
        <p className="text-slate-400">From health goals to work projects, Constrix makes consistency rewarding</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-pink-500/30 transition-all group transform-gpu hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 scroll-animate cursor-pointer"
          onMouseEnter={() => setActiveCard(0)}
          onMouseLeave={() => setActiveCard(null)}
          style={{
            transform: activeCard === 0 ? 'rotateY(-10deg) rotateX(5deg) scale(1.05)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-16 w-16 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Heart size={28} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Health & Fitness</h3>
          <p className="text-slate-400 mb-6">
            Never motivated to floss? Can't seem to get to the gym? Constrix finally makes it fun to get healthy.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              Daily workouts & step tracking
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              Meditation & mindfulness
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              Nutrition & hydration goals
            </div>
          </div>
        </div>

        <div 
          className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-blue-500/30 transition-all group transform-gpu hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 scroll-animate cursor-pointer"
          onMouseEnter={() => setActiveCard(1)}
          onMouseLeave={() => setActiveCard(null)}
          style={{
            transform: activeCard === 1 ? 'rotateY(0deg) rotateX(-5deg) scale(1.05)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-16 w-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <BookOpen size={28} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">School & Work</h3>
          <p className="text-slate-400 mb-6">
            Whether you're preparing a report for your teacher or your boss, it's easy to keep track of your progress as you tackle your toughest tasks.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Study sessions & skill building
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Project milestones & deadlines
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Professional development
            </div>
          </div>
        </div>

        <div 
          className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-emerald-500/30 transition-all group transform-gpu hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 scroll-animate cursor-pointer"
          onMouseEnter={() => setActiveCard(2)}
          onMouseLeave={() => setActiveCard(null)}
          style={{
            transform: activeCard === 2 ? 'rotateY(10deg) rotateX(5deg) scale(1.05)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-16 w-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Target size={28} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">And Much More!</h3>
          <p className="text-slate-400 mb-6">
            Our fully customizable task list means that you can shape Constrix to fit your personal goals. Work on creative projects, emphasize self-care, or pursue a different dream -- it's all up to you.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Creative & artistic pursuits
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Self-care & mental wellness
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Personal passion projects
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
  <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="mb-16 scroll-animate">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transform-gpu hover:scale-105 transition-all duration-300">The Loop</h2>
        <p className="text-slate-400">Simple actions. Compound results.</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-slate-800 hidden md:block animate-pulse" />

        <div className="space-y-12">
          {[
            {
              title: "Create & Commit",
              desc: "Choose a habit (Study or Fitness). Set your daily check-in goal and start building your streak.",
              icon: <Lock size={20} />,
              color: "text-indigo-400"
            },
            {
              title: "Verify Daily",
              desc: "Complete your task. The app validates it via API integrations or social witnessing in Verychat.",
              icon: <Activity size={20} />,
              color: "text-pink-400"
            },
            {
              title: "Mint & Earn",
              desc: "Hit milestones (7, 30, 100 days). Mint immutable NFT badges and unlock VERY token rewards.",
              icon: <Flame size={20} />,
              color: "text-orange-400"
            }
          ].map((step, i) => (
            <div 
              key={i} 
              className="relative flex gap-8 items-start scroll-animate transform-gpu hover:scale-105 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div 
                className="hidden md:flex h-16 w-16 bg-slate-900 border border-slate-800 rounded-2xl items-center justify-center z-10 shrink-0 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-500"
                style={{
                  transform: activeStep === i ? 'scale(1.2) rotate(12deg)' : 'scale(1) rotate(0deg)',
                  boxShadow: activeStep === i ? '0 20px 40px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                <div className={`${step.color} animate-pulse`}>{step.icon}</div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3 transform-gpu hover:translate-x-2 transition-all duration-300">
                  <span className="md:hidden p-2 bg-slate-900 rounded-lg border border-slate-800 animate-pulse">{step.icon}</span>
                  {step.title}
                </h3>
                <p className="text-slate-400 max-w-xl">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/5 py-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center text-xs text-white font-bold">C</div>
          <span className="text-lg font-bold text-white">Constrix</span>
        </div>
        <p className="text-slate-500 text-sm max-w-xs">
          The habit layer for the new internet.
        </p>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><Link href="/dashboard" className="hover:text-indigo-400">Dashboard</Link></li>
          <li><Link href="#" className="hover:text-indigo-400">Leaderboard</Link></li>
          <li><Link href="#" className="hover:text-indigo-400">Milestones</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-4">Ecosystem</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><a href="https://www.veryscan.io/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">Verychain Explorer</a></li>
          <li><a href="#" className="hover:text-indigo-400">Verychat Community</a></li>
          <li><a href="https://wp.verylabs.io/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">Documentation</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-slate-600">
      © 2025 Constrix. All rights reserved.
    </div>
  </footer>
);

export default function HomePage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (walletType: WalletType) => {
    try {
      setConnecting(true);
      setShowWalletModal(false);
      await login(walletType);
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleJoinHabitRoom = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'intent://verychat#Intent;scheme=verychat;package=com.add.verychat_app;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.add.verychat_app&hl=en-US&pli=1;end';
    } else {
      window.open('https://play.google.com/store/apps/details?id=com.add.verychat_app&hl=en-US&pli=1', '_blank');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-in-up');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <main className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 overflow-x-hidden">
      <style jsx global>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in-up {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-count-up {
          animation: count-up 2s ease-out;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes count-up {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <Navbar onConnectWallet={handleConnectWallet} isConnecting={connecting} />
      <Hero onConnectWallet={handleConnectWallet} isConnecting={connecting} />
      <UseCases />
      <HowItWorks />
      <FeatureBento />
      
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-900/50 to-violet-900/50 rounded-3xl p-12 text-center border border-indigo-500/20 relative overflow-hidden transform-gpu hover:scale-[1.02] transition-all duration-500 scroll-animate">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-gradient-x bg-gradient-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent">Ready to prove your consistency?</h2>
            <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
              Join 10,000+ early adopters building their on-chain reputation today.
            </p>
            <button 
              onClick={handleConnectWallet}
              disabled={connecting}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-indigo-50 transition-all shadow-lg shadow-white/10 disabled:opacity-50 transform-gpu hover:scale-110 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
            >
              {connecting ? 'Connecting...' : 'Launch Dashboard'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse" />
        </div>
      </section>

      <Footer />
      
      <WalletSelectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
        isConnecting={connecting}
      />
    </main>
  );
}