import React, { useState } from 'react';
import { Case } from '../types';
import { PriorityBadge, TrendBadge, StageBadge } from './StatusBadge';
import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CaseTableProps {
  cases: Case[];
}

export const CaseTable: React.FC<CaseTableProps> = ({ cases }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = cases.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-semibold text-slate-800 text-lg">Priority Cases</h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by ID or District..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Case ID</th>
              <th className="px-6 py-4 font-semibold">District</th>
              <th className="px-6 py-4 font-semibold">Stage</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Trend</th>
              <th className="px-6 py-4 font-semibold">Assigned</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCases.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{c.id}</td>
                <td className="px-6 py-4 text-slate-600">{c.district}</td>
                <td className="px-6 py-4"><StageBadge stage={c.caseStage} /></td>
                <td className="px-6 py-4"><PriorityBadge priority={c.priority} /></td>
                <td className="px-6 py-4"><TrendBadge trend={c.distressTrend} /></td>
                <td className="px-6 py-4 text-slate-600 text-sm">{c.assignedCounsellor}</td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/cases/${c.id}`}
                    className="inline-flex items-center justify-center gap-1 text-sm font-medium text-primary hover:text-primary-hover bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Review <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filteredCases.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No cases found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
