'use client';

import React from 'react';

export const ScrollIndicator = () => {
  return (
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
         <div className="w-1 h-12 rounded-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
      </div>
  );
};
