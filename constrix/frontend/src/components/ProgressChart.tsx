'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressChartProps {
  title: string;
  data: { label: string; value: number; change?: number }[];
  timeframe: string;
}

export default function ProgressChart({ title, data, timeframe }: ProgressChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{timeframe}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const hasChange = item.change !== undefined;
          const isPositive = hasChange && item.change! > 0;
          const isNegative = hasChange && item.change! < 0;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.value}</span>
                  {hasChange && (
                    <div className={`flex items-center gap-1 text-xs ${
                      isPositive ? 'text-emerald-400' : 
                      isNegative ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {isPositive ? <TrendingUp size={12} /> : 
                       isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
                      <span>{Math.abs(item.change!)}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">
              {data.reduce((sum, item) => sum + item.value, 0)}
            </div>
            <div className="text-xs text-slate-400">Total this {timeframe.toLowerCase()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-emerald-400">
              {Math.round((data.reduce((sum, item) => sum + item.value, 0) / data.length))}
            </div>
            <div className="text-xs text-slate-400">Daily average</div>
          </div>
        </div>
      </div>
    </div>
  );
}