import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
      </div>
    </div>
  </div>
);