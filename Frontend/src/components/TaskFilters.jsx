import React from 'react';

export default function TaskFilters({ filter, setFilter, theme }) {
  const isLight = theme === 'light';

  const filterOptions = [
    { id: 'ALL', label: 'All Tasks' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'COMPLETED', label: 'Completed' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 pb-2">
      {filterOptions.map((item) => {
        // Case-insensitive check to see if this filter is active
        const isActive = (filter || 'ALL').toUpperCase().replace(/[\s_]/g, '') === item.id.replace(/[\s_]/g, '');
        
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              isActive 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                : isLight 
                  ? 'bg-slate-100/80 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/60' 
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}