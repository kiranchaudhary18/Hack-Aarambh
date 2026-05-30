import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Users, BarChart3, Clock, AlertOctagon,
  Globe, AlertTriangle, Eye, ShieldQuestion, CheckSquare, Trash2, Sparkles, Terminal
} from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { mockScamReports, mockStatistics } from '../../mock/mockData';
import gsap from 'gsap';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState(mockScamReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // GSAP staggers
    gsap.fromTo('.admin-stat-card', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  const handleAction = (id, newStatus) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setIsModalOpen(false);
  };

  const handleOpenReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto relative z-10">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cyber-border/40 pb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
            Security Control Operations
          </h1>
          <p className="text-sm text-cyber-gray mt-2 font-medium">
            Global administrative threat command node auditing domain spoofs, check frauds, and pressure vectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/admin/analytics')} 
            variant="secondary" 
            size="sm"
            icon={BarChart3}
          >
            Threat Analytics
          </Button>
          <Button 
            onClick={() => navigate('/admin/flagged')} 
            variant="danger" 
            size="sm"
            icon={ShieldAlert}
          >
            Blocked Warnings
          </Button>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card glowColor="purple" className="admin-stat-card p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-wider">Ecosystem Scans</p>
              <h3 className="text-3xl font-black text-white font-mono mt-1">28,430</h3>
            </div>
            <div className="p-3 bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-cyber-glow font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 120 Scans past hour
          </p>
        </Card>

        <Card glowColor="pink" className="admin-stat-card p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-wider">Total Scams Detected</p>
              <h3 className="text-3xl font-black text-cyber-pink font-mono mt-1">9,812</h3>
            </div>
            <div className="p-3 bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20 rounded-2xl animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-cyber-pink font-bold uppercase tracking-wider">34.5% Detection Coefficient</p>
        </Card>

        <Card glowColor="cyan" className="admin-stat-card p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-wider">Blacklisted Domains</p>
              <h3 className="text-3xl font-black text-cyber-blue font-mono mt-1">1,403</h3>
            </div>
            <div className="p-3 bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 rounded-2xl">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-cyber-blue font-bold uppercase tracking-wider">32 Domains Added Today</p>
        </Card>

        <Card glowColor="green" className="admin-stat-card p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-wider">Moderation Backlog</p>
              <h3 className="text-3xl font-black text-cyber-glow font-mono mt-1">
                {reports.filter(r => r.status === 'under_review' || r.status === 'flagged').length}
              </h3>
            </div>
            <div className="p-3 bg-cyber-glow/10 text-cyber-glow border border-cyber-glow/20 rounded-2xl animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-cyber-glow font-bold uppercase tracking-wider">Response: ~4 Minutes</p>
        </Card>
      </div>

      {/* Flagged Cases Ledger */}
      <Card glowColor="pink" className="p-6">
        <CardHeader className="mb-6">
          <div>
            <CardTitle className="text-lg uppercase tracking-tight">Active Moderation Incidents Queue</CardTitle>
            <CardDescription className="text-xs">Incoming suspicious files requiring security moderator validation checks.</CardDescription>
          </div>
        </CardHeader>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cyber-border/40 text-cyber-gray font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Incident ID</th>
                <th className="pb-3">Spoofed Entity</th>
                <th className="pb-3">Reporting Candidate</th>
                <th className="pb-3">Threat Index</th>
                <th className="pb-3">Severity Level</th>
                <th className="pb-3 pr-2 text-right">Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/20">
              {reports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-white/5 transition-all duration-200 group cursor-pointer"
                  onClick={() => handleOpenReport(report)}
                >
                  <td className="py-4 pl-2 font-mono text-cyber-blue font-bold">
                    {report.id}
                  </td>
                  <td className="py-4 font-bold text-white uppercase">
                    {report.jobTitle}
                    <span className="block text-[10px] text-cyber-gray mt-1.5 font-semibold leading-none">{report.companyName}</span>
                  </td>
                  <td className="py-4 text-cyber-gray font-semibold">
                    {report.reportedBy}
                    <span className="block text-[9px] font-mono mt-1.5 font-normal leading-none">{report.date}</span>
                  </td>
                  <td className="py-4 font-bold">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono ${
                      report.fraudScore > 80 ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {report.fraudScore}%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 uppercase tracking-widest font-bold text-[8px] px-2 py-0.5 rounded-full ${
                      report.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      report.severity === 'high' ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' :
                      'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30'
                    }`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenReport(report); }}
                      className="p-1.5 rounded-lg bg-white/5 border border-cyber-border hover:border-cyber-blue hover:text-cyber-glow transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Moderation details modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Admin Security Incident Review"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex justify-between items-start gap-4 p-4 rounded-xl bg-white/3 border border-cyber-border">
              <div>
                <p className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Impersonation Target</p>
                <p className="text-base font-bold text-white uppercase">{selectedReport.companyName}</p>
                <p className="text-xs text-cyber-gray mt-0.5">{selectedReport.jobTitle}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Threat Index</p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30">
                  {selectedReport.fraudScore}% Probability
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-cyber-blue uppercase tracking-widest">Incident Category</h5>
              <p className="text-xs text-white bg-[#050811] px-3 py-2.5 rounded-xl border border-cyber-border font-bold">
                {selectedReport.scamType}
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-cyber-pink uppercase tracking-widest">Flagged Compliance Anomalies</h5>
              <ul className="space-y-2.5">
                {selectedReport.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-cyber-gray leading-relaxed font-semibold">
                    <span className="text-cyber-pink font-bold font-mono">{"[!]"}</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-cyber-border/40 mt-6">
              <Button 
                onClick={() => handleAction(selectedReport.id, 'verified_fraud')} 
                variant="danger" 
                size="sm" 
                className="flex-1 text-xs"
                icon={ShieldAlert}
              >
                Verify Scam Vector
              </Button>
              <Button 
                onClick={() => handleAction(selectedReport.id, 'safe')} 
                variant="glow" 
                size="sm" 
                className="flex-1 text-xs text-white hover:text-black"
                icon={ShieldCheck}
              >
                Mark as Genuine
              </Button>
              <Button 
                onClick={() => handleAction(selectedReport.id, 'under_review')} 
                variant="secondary" 
                size="sm" 
                className="flex-1 text-xs"
                icon={ShieldQuestion}
              >
                Keep Under Audit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
