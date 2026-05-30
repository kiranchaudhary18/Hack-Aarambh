import React from 'react';
import { BarChart3, TrendingUp, ShieldAlert, Cpu, AlertTriangle, ShieldCheck, Download, Sparkles } from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockStatistics } from '../../mock/mockData';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const AnalyticsPage = () => {
  const trendData = mockStatistics.monthlyThreatTrend;
  const scansData = mockStatistics.dailyScans;
  const categoriesData = mockStatistics.scamCategories;

  return (
    <div className="space-y-10 max-w-6xl mx-auto relative z-10">
      
      {/* Title */}
      <div className="border-b border-cyber-border/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
            Threat Intelligence Analytics
          </h1>
          <p className="text-sm text-cyber-gray mt-2 font-medium">
            Global ecosystem analytical summaries, machine learning classification precision coefficient logs, and active threat volumes.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={Download}>
          Export Intelligence Briefing
        </Button>
      </div>

      {/* Advanced charts grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cumulative Threat scale */}
        <Card glowColor="purple" className="md:col-span-2 p-6 h-96 flex flex-col justify-between">
          <CardHeader className="mb-4">
            <div>
              <CardTitle className="text-lg uppercase tracking-tight">Cybersecurity Threat Scale Trend</CardTitle>
              <CardDescription className="text-xs">Cumulative phishing recruit incidents blocked over five months.</CardDescription>
            </div>
          </CardHeader>
          <div className="w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b026ff" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#b026ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#050811', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="threats" stroke="#b026ff" strokeWidth={3} fillOpacity={1} fill="url(#purpleThreats)" name="Blocked Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Pie Chart */}
        <Card glowColor="pink" className="p-6 h-96 flex flex-col justify-between">
          <CardHeader className="mb-4">
            <div>
              <CardTitle className="text-lg uppercase tracking-tight">Spoofing Attack Ratio</CardTitle>
              <CardDescription className="text-xs">Breakdown percentage of recruitment phishing types.</CardDescription>
            </div>
          </CardHeader>
          
          <div className="w-full flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#050811', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom overlay stats */}
            <div className="absolute text-center">
              <p className="text-2xl font-black text-white font-mono">5 Vectors</p>
              <p className="text-[8px] text-cyber-gray uppercase font-bold tracking-widest mt-1">Scam Classes</p>
            </div>
          </div>

          {/* Indicators description */}
          <div className="grid grid-cols-2 gap-2.5 mt-4 text-[9px] font-bold text-cyber-gray uppercase tracking-wider">
            {categoriesData.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Scan Spikes */}
        <Card glowColor="cyan" className="md:col-span-3 p-6 h-96 flex flex-col justify-between">
          <CardHeader className="mb-4">
            <div>
              <CardTitle className="text-lg uppercase tracking-tight">Active Scan Volatility</CardTitle>
              <CardDescription className="text-xs">Dynamic scanner inquiries processed by node APIs weekly.</CardDescription>
            </div>
          </CardHeader>

          <div className="w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scansData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#050811', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                <Bar dataKey="scans" fill="#00f2fe" radius={[4, 4, 0, 0]} name="API Scans Requested" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AnalyticsPage;
