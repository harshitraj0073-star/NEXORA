import React from 'react';
import { useStore } from '../hooks/useStore';
import { MetricCard } from '../components/MetricCard';
import {
  Users, Activity, AlertTriangle, ShieldCheck,
  CheckCircle2, TrendingUp, TrendingDown, MapPin,
  Stethoscope, BarChart2, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
  AreaChart, Area, LineChart, Line, Legend
} from 'recharts';

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#10b981',
  Moderate: '#f59e0b',
  High: '#ef4444',
  Urgent: '#991b1b',
};

const STAGE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export const AdminDashboard: React.FC = () => {
  const { state } = useStore();
  const allCases = state.cases;

  const totalCases = allCases.length;
  const underMonitoring = allCases.filter(c => c.timeline.some(t => t.type === 'checkin')).length;
  const highPriority = allCases.filter(c => c.priority === 'High' || c.priority === 'Urgent').length;
  const pendingInterventions = allCases.reduce((acc, c) => acc + c.interventions.length, 0);
  const completedFollowUps = 24;
  const avgDistress = Math.round(allCases.reduce((a, c) => a + c.distressScore, 0) / (allCases.length || 1));
  const urgentCases = allCases.filter(c => c.priority === 'Urgent').length;

  const districts = [...new Set(allCases.map(c => c.district))];
  const districtData = districts.map(d => ({
    name: d.length > 10 ? d.slice(0, 10) + '…' : d,
    fullName: d,
    cases: allCases.filter(c => c.district === d).length,
    high: allCases.filter(c => c.district === d && (c.priority === 'High' || c.priority === 'Urgent')).length,
  }));

  const priorityData = [
    { name: 'Low', value: allCases.filter(c => c.priority === 'Low').length, color: '#10b981' },
    { name: 'Moderate', value: allCases.filter(c => c.priority === 'Moderate').length, color: '#f59e0b' },
    { name: 'High', value: allCases.filter(c => c.priority === 'High').length, color: '#ef4444' },
    { name: 'Urgent', value: allCases.filter(c => c.priority === 'Urgent').length, color: '#991b1b' },
  ];

  const stageData = [
    { name: 'Investigation', value: allCases.filter(c => c.caseStage === 'Investigation').length, color: STAGE_COLORS[0] },
    { name: 'Trial', value: allCases.filter(c => c.caseStage === 'Trial').length, color: STAGE_COLORS[1] },
    { name: 'Rehab', value: allCases.filter(c => c.caseStage === 'Rehabilitation').length, color: STAGE_COLORS[2] },
    { name: 'Compensation', value: allCases.filter(c => c.caseStage === 'Compensation').length, color: STAGE_COLORS[3] },
  ];

  // 6-month trend (mock)
  const monthlyTrend = [
    { month: 'Apr', registered: 12, interventions: 4, resolved: 8 },
    { month: 'May', registered: 15, interventions: 6, resolved: 10 },
    { month: 'Jun', registered: 18, interventions: 8, resolved: 12 },
    { month: 'Jul', registered: 16, interventions: 7, resolved: 11 },
    { month: 'Aug', registered: 20, interventions: 9, resolved: 14 },
    { month: 'Sep', registered: totalCases, interventions: pendingInterventions, resolved: completedFollowUps },
  ];

  // Distress heatmap by district
  const distressHeatmap = districts.map(d => {
    const cases = allCases.filter(c => c.district === d);
    return {
      district: d.length > 12 ? d.slice(0, 12) + '…' : d,
      avgDistress: Math.round(cases.reduce((a, c) => a + c.distressScore, 0) / (cases.length || 1)),
      count: cases.length,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">State Analytics</h2>
          <p className="text-sm text-slate-500 mt-0.5">Aggregate wellbeing and intervention metrics · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary shadow-sm">
            <option>All Districts</option>
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary shadow-sm">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total Cases', value: totalCases, icon: Users, color: 'blue', trend: '+3 this week', up: true },
          { label: 'Monitoring', value: underMonitoring, icon: Activity, color: 'emerald', trend: '+5%', up: true },
          { label: 'High Priority', value: highPriority, icon: AlertTriangle, color: 'red', trend: '+2', up: false },
          { label: 'Urgent', value: urgentCases, icon: ShieldCheck, color: 'rose', trend: 'critical', up: false },
          { label: 'Interventions', value: pendingInterventions, icon: Stethoscope, color: 'orange', trend: 'pending', up: null },
          { label: 'Follow-ups', value: completedFollowUps, icon: CheckCircle2, color: 'purple', trend: 'done', up: true },
          { label: 'Avg Distress', value: avgDistress, icon: BarChart2, color: 'indigo', trend: '/100', up: null },
        ].map(({ label, value, icon: Icon, color, trend, up }) => (
          <div key={label} className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-50`}>
              <Icon className={`w-4 h-4 text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 leading-tight">{label}</p>
            <span className={`text-[10px] font-medium flex items-center gap-0.5 ${up === true ? 'text-emerald-600' : up === false ? 'text-red-500' : 'text-slate-400'}`}>
              {up === true && <TrendingUp className="w-3 h-3" />}
              {up === false && <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          </div>
        ))}
      </div>

      {/* Monthly Trend + Priority Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">6-Month Case Trend</h3>
              <p className="text-xs text-slate-500">Registered, interventions, and resolved cases</p>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-reg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grad-res" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                <Area type="monotone" dataKey="registered" name="Registered" stroke="#3b82f6" strokeWidth={2.5} fill="url(#grad-reg)" dot={{ r: 4, fill: '#3b82f6' }} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2.5} fill="url(#grad-res)" dot={{ r: 4, fill: '#10b981' }} />
                <Line type="monotone" dataKey="interventions" name="Interventions" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3, fill: '#f59e0b' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Donut */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800">Priority Distribution</h3>
            <p className="text-xs text-slate-500">Across all registered cases</p>
          </div>
          <div className="h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800">{totalCases}</span>
              <span className="text-xs text-slate-400">total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {priorityData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-500 text-xs">{item.name}</span>
                <span className="font-bold text-slate-700 text-xs ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District + Stage + Distress Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Cases by District</h3>
              <p className="text-xs text-slate-500">Total and high-priority breakdown</p>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="cases" name="Total" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
                <Bar dataKey="high" name="High/Urgent" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cases by Stage */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800">Cases by Stage</h3>
            <p className="text-xs text-slate-500">Legal process pipeline</p>
          </div>
          <div className="space-y-4 mt-4">
            {stageData.map((s, i) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{s.name}</span>
                  <span className="text-slate-800 font-bold">{s.value}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(s.value / totalCases) * 100}%`, backgroundColor: STAGE_COLORS[i] }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500 mb-3">Avg Distress by District</p>
            <div className="space-y-2">
              {distressHeatmap.slice(0, 4).map(d => (
                <div key={d.district} className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-600 flex-1 truncate">{d.district}</span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${d.avgDistress}%`,
                      backgroundColor: d.avgDistress > 70 ? '#ef4444' : d.avgDistress > 50 ? '#f59e0b' : '#10b981'
                    }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-6 text-right">{d.avgDistress}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Check-ins This Week', value: '47', sub: '+12% from last week', color: 'blue' },
          { label: 'Avg Response Time', value: '1.8h', sub: 'Counsellor follow-up', color: 'emerald' },
          { label: 'Cases Escalated', value: '3', sub: 'Requires urgent review', color: 'red' },
          { label: 'System Uptime', value: '99.8%', sub: 'Platform availability', color: 'purple' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
            <p className={`text-xs text-${color}-500 mt-1`}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
