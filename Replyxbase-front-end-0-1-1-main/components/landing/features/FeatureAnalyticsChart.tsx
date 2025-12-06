"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

const FeatureAnalyticsChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#005bbc" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#005bbc" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            border: '2px solid #e2e8f0', 
            backgroundColor: 'white' 
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#005bbc" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#colorValue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default FeatureAnalyticsChart;
