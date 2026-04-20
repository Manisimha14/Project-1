import React from 'react';
import { History, X } from 'lucide-react';

const SearchHistory = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="glass-card w-full max-w-md mx-auto mt-4 p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-white/70">
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">Recent Searches</span>
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((city, index) => (
          <button
            key={index}
            onClick={() => onSelect(city)}
            className="bg-white/5 hover:bg-white/20 border border-white/10 rounded-full px-4 py-1.5 text-sm transition-all active:scale-95"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
