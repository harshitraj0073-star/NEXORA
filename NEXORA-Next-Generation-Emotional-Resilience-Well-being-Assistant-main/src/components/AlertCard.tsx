import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlertCardProps {
  id: string;
  caseId: string;
  title: string;
  description: string;
  timeAgo: string;
  indicators: string[];
  priority: 'High' | 'Urgent';
}

export const AlertCard: React.FC<AlertCardProps> = ({
  caseId,
  description,
  timeAgo,
  indicators,
  priority
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 p-5 ${priority === 'Urgent' ? 'border-red-600' : 'border-orange-500'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${priority === 'Urgent' ? 'text-red-600' : 'text-orange-500'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${priority === 'Urgent' ? 'text-red-600' : 'text-orange-600'}`}>
            {priority} Priority
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo}
        </div>
      </div>
      
      <h3 className="font-bold text-slate-800 text-lg mb-1">Case {caseId}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      
      <div className="bg-slate-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Risk Indicators</p>
        <ul className="space-y-1">
          {indicators.map((ind, i) => (
            <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              {ind}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center gap-3">
        <Link 
          to={`/cases/${caseId}`}
          className="flex-1 text-center py-2 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          Review Case
        </Link>
        <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
};
