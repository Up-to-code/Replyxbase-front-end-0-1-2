import React from 'react';
import { Star } from 'lucide-react';

/**
 * Props for the Rating component.
 */
interface RatingProps {
  /** The rating value (0-5) */
  rating?: number;
}

/**
 * Displays a star rating.
 */
export const Rating: React.FC<RatingProps> = ({ rating }) => {
  if (!rating) return null;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'text-[#0ea5e9] fill-current'
              : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  );
};