import React from 'react';
import { useStore } from '../hooks/useStore';
import { MetricCard } from '../components/MetricCard';
import { CaseTable } from '../components/CaseTable';
import { DistressChart } from '../components/DistressChart';
import { AlertCard } from '../components/AlertCard';
import {
  Users, Activity, AlertTriangle, Clock,
  TrendingUp, TrendingDown, Heart, Stethoscope,
  CheckCircle, Brain, Calendar, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MiniAreaChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={48}>
    <AreaChart data={data.map((v, i) => ({ v, i }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.25} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

export const CounsellorDashboard: React.FC = () => {
  const { state } = useStore();
  const counsellorName = 'Dr. A. Sharma';
  const myCases = state.role === 'admin'
    ? state.cases
    : state.cases.filter(c => c.assignedCounsellor === counsellorName || c.assignedCounsellor === 'Unassigned');

  const activeCases = myCases.length;
  const underMonitoring = myCases.filter(c => c.timeline.some(t => t.type === 'checkin')).length;
  const highPriority = myCases.filter(c => c.priority === 'High' || c.priority === 'Urgent').length;
  const pendingAlerts = myCases.filter(c => c.alerts.length > 0).length;
  const resolvedCases = myCases.filter(c => c.priority === 'Low').length;
  const avgDistress = Math.round(myCases.reduce((a, c) => a + c.distressScore, 0) / (myCases.length || 1));

  const trendData = [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), score: 42 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), score: 38 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), score: 45 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), score: 52 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), score: 58 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 55 },
    { date: new Date().toISOString(), score: 64 },
  ];

  const weeklyCheckIns = [4, 7, 5, 9, 6, 3, 8];
  const weeklyAlerts = [1, 2, 1, 3, 2, 0, 2];
  const weeklyResolved = [2, 3, 4, 2, 5, 1, 3];

  const wellbeingRadar = [
    { subject: 'Sentiment', A: 68 },
    { subject: 'Engagement', A: 72 },
    { subject: 'Sleep', A: 54 },
    { subject: 'Social', A: 61 },
    { subject: 'Stability', A: 77 },
    { subject: 'Coping', A: 58 },
  ];

  const casesWithAlerts = myCases.filter(c => c.alerts.length > 0).slice(0, 3);

  const recentActivity = [
    { time: '09:41 AM', text: 'Case NEXORA-14566 check-in completed', type: 'checkin' },
    { time: '09:15 AM', text: 'Intervention recorded for NEXORA-14569', type: 'intervention' },
    { time: 'Yesterday', text: 'High distress alert: NEXORA-14567', type: 'alert' },
    { time: 'Yesterday', text: 'Counsellor follow-up scheduled: NEXORA-14568', type: 'followup' },
  ];

  const activityIcon: Record<string, { color: string; Icon: React.FC<{ className?: string }> }> = {
    checkin: { color: 'text-emerald-500 bg-emerald-50', Icon: Heart },
    intervention: { color: 'text-blue-500 bg-blue-50', Icon: Stethoscope },
    alert: { color: 'text-red-500 bg-red-50', Icon: AlertTriangle },
    followup: { color: 'text-purple-500 bg-purple-50', Icon: Calendar },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clinical Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, <span className="font-medium text-primary">{counsellorName}</span> · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200 text-sm font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Monitoring Active
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Active Cases */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-4 h-4 text-blue-600" /></div>
            <span className="flex items-center text-xs text-emerald-600 font-medium gap-0.5"><TrendingUp className="w-3 h-3" />+3</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{activeCases}</p>
          <p className="text-xs text-slate-500 mt-0.5">Active Cases</p>
          <MiniAreaChart data={[10, 12, 11, 14, 13, 16, activeCases]} color="#3b82f6" />
        </div>

        {/* Under Monitoring */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg"><Activity className="w-4 h-4 text-emerald-600" /></div>
            <span className="flex items-center text-xs text-emerald-600 font-medium gap-0.5"><TrendingUp className="w-3 h-3" />+5%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{underMonitoring}</p>
          <p className="text-xs text-slate-500 mt-0.5">In Monitoring</p>
          <MiniAreaChart data={[2, 3, 3, 4, 3, 4, underMonitoring]} color="#10b981" />
        </div>

        {/* High Priority */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
            <span className="flex items-center text-xs text-red-500 font-medium gap-0.5"><TrendingUp className="w-3 h-3" />+2</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{highPriority}</p>
          <p className="text-xs text-slate-500 mt-0.5">High Priority</p>
          <MiniAreaChart data={[3, 3, 4, 5, 4, 5, highPriority]} color="#ef4444" />
        </div>

        {/* Pending Alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-50 rounded-lg"><Clock className="w-4 h-4 text-orange-600" /></div>
            <span className="flex items-center text-xs text-orange-500 font-medium gap-0.5">{pendingAlerts} open</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{pendingAlerts}</p>
          <p className="text-xs text-slate-500 mt-0.5">Pending Alerts</p>
          <MiniAreaChart data={[2, 1, 3, 2, 4, 3, pendingAlerts]} color="#f97316" />
        </div>

        {/* Avg Distress */}
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl shadow-sm p-4 col-span-1 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/20 rounded-lg"><Brain className="w-4 h-4 text-white" /></div>
            <span className="text-xs text-blue-100">/100</span>
          </div>
          <p className="text-2xl font-bold">{avgDistress}</p>
          <p className="text-xs text-blue-100 mt-0.5">Avg Distress Score</p>
          <div className="mt-3 h-1.5 bg-white/20 rounded-full">
            <div className="h-1.5 bg-white rounded-full" style={{ width: `${avgDistress}%` }}></div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-50 rounded-lg"><CheckCircle className="w-4 h-4 text-purple-600" /></div>
            <span className="flex items-center text-xs text-emerald-600 font-medium gap-0.5"><TrendingDown className="w-3 h-3" />stable</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{resolvedCases}</p>
          <p className="text-xs text-slate-500 mt-0.5">Low Risk</p>
          <MiniAreaChart data={[5, 6, 7, 6, 7, 7, resolvedCases]} color="#8b5cf6" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Distress Trend */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Distress Score Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">7-day aggregate across monitored cases</p>
            </div>
            <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100">⚠ Threshold: 60</span>
          </div>
          <DistressChart data={trendData} />
        </div>

        {/* Wellbeing Radar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800">Wellbeing Dimensions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Average across active cases</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={wellbeingRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#1e40af" fill="#1e40af" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {wellbeingRadar.map(d => (
              <div key={d.subject} className="text-center">
                <p className="text-xs text-slate-500">{d.subject}</p>
                <p className="text-sm font-bold text-slate-700">{d.A}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Check-ins */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-1">Weekly Activity</h3>
          <p className="text-xs text-slate-500 mb-4">Check-ins, alerts & resolved this week</p>
          <div className="space-y-4">
            {[
              { label: 'Check-ins', data: weeklyCheckIns, color: '#3b82f6', total: weeklyCheckIns.reduce((a, b) => a + b, 0) },
              { label: 'Alerts', data: weeklyAlerts, color: '#ef4444', total: weeklyAlerts.reduce((a, b) => a + b, 0) },
              { label: 'Resolved', data: weeklyResolved, color: '#10b981', total: weeklyResolved.reduce((a, b) => a + b, 0) },
            ].map(({ label, data, color, total }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{label}</span><span className="font-semibold text-slate-700">{total} this week</span>
                </div>
                <div className="flex items-end gap-0.5 h-10">
                  {data.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-sm transition-all" style={{ height: `${(v / 10) * 100}%`, backgroundColor: color, opacity: 0.8 }}></div>
                      <span className="text-[9px] text-slate-400">{WEEK_DAYS[i].slice(0, 1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Recent Activity</h3>
            <span className="text-xs text-primary hover:underline cursor-pointer">View all</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const { color, Icon } = activityIcon[item.type];
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${color}`}><Icon className="w-3.5 h-3.5" /></div>
                  <div>
                    <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Active Alerts</h3>
            <span className="text-xs font-medium bg-red-100 text-red-600 px-2.5 py-1 rounded-full border border-red-100">{pendingAlerts} new</span>
          </div>
          <div className="space-y-3">
            {casesWithAlerts.map(c => (
              <AlertCard
                key={c.id}
                id={`alert_${c.id}`}
                caseId={c.id}
                title="Risk Indicators Detected"
                description="Distress indicators have increased across recent check-ins."
                timeAgo="2 hours ago"
                indicators={c.alerts}
                priority={c.priority as any}
              />
            ))}
            {casesWithAlerts.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-300" />
                <p className="text-sm">No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">Assigned Cases</h3>
            <p className="text-xs text-slate-500">{activeCases} total cases across all districts</p>
          </div>
          <a href="/cases" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
            View All <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <CaseTable cases={myCases.slice(0, 7)} />
      </div>
    </div>
  );
};
