import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, ShieldCheck, Eye, Calendar, Building, ChevronRight, Sparkles } from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { mockScamReports } from '../../mock/mockData';
import gsap from 'gsap';

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [selectedScam, setSelectedScam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // GSAP stagger card entry animation
    gsap.fromTo('.scam-ledger-card', 
      { opacity: 0, y: 35 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, [searchQuery, filterType]);

  const handleOpenDetails = (scam) => {
    setSelectedScam(scam);
    setIsModalOpen(true);
  };

  const filteredReports = mockScamReports.filter((report) => {
    const matchesSearch = report.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          report.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.scamType.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesFilter = filterType === 'all' || report.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10 max-w-6xl mx-auto relative z-10">
      
      {/* Title */}
      <div className="border-b border-cyber-border/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
            Incidents Database Ledger
          </h1>
          <p className="text-sm text-cyber-gray mt-2 font-medium">
            Global scan history cataloging phishing recruit attempts, lookalike domains, and active scam indicators.
          </p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            id="search-database"
            type="text"
            placeholder="Search company, job role, or scam type..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {['all', 'verified_fraud', 'flagged', 'under_review'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                filterType === type 
                  ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-black border-transparent shadow-neon-cyan/20' 
                  : 'glassmorphism border-cyber-border/80 text-cyber-gray hover:text-white hover:border-cyber-blue/30'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <Card 
            key={report.id} 
            glowColor={report.status === 'verified_fraud' ? 'pink' : report.status === 'flagged' ? 'none' : 'purple'}
            className="scam-ledger-card p-6 cursor-pointer"
            onClick={() => handleOpenDetails(report)}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-1">
                <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                  report.status === 'verified_fraud' ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' :
                  report.status === 'flagged' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyber-glow transition-colors mt-2 uppercase">{report.jobTitle}</h3>
                <div className="flex items-center gap-1.5 text-xs text-cyber-gray font-semibold mt-1">
                  <Building className="w-3.5 h-3.5 text-cyber-blue" />
                  <span>{report.companyName}</span>
                </div>
              </div>

              {/* Fraud index */}
              <div className="text-center p-2.5 rounded-xl bg-white/3 border border-cyber-border/80 min-w-[70px]">
                <p className="text-[8px] text-cyber-gray uppercase font-bold tracking-wider">Threat Index</p>
                <p className={`text-base font-black font-mono mt-0.5 ${
                  report.fraudScore > 80 ? 'text-cyber-pink' : 'text-yellow-400'
                }`}>{report.fraudScore}%</p>
              </div>
            </div>

            <hr className="border-cyber-border/40 my-4" />

            <div className="flex items-center justify-between text-xs text-cyber-gray font-semibold">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-cyber-blue" />
                <span className="font-mono">Audited: {report.date}</span>
              </div>
              <span className="text-cyber-blue flex items-center gap-1 hover:underline">
                Inspect Sandbox <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-2 text-center p-12 glassmorphism rounded-30px border border-cyber-border">
            <ShieldAlert className="w-8 h-8 text-cyber-gray mx-auto mb-4" />
            <p className="text-sm text-cyber-gray font-semibold uppercase tracking-wider">No matching threat profiles registered.</p>
          </div>
        )}
      </div>

      {/* Scam Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Incident Forensic Signature"
      >
        {selectedScam && (
          <div className="space-y-6">
            <div className="flex justify-between items-start gap-4 p-4 rounded-xl bg-white/3 border border-cyber-border">
              <div>
                <p className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Target Spoofed Entity</p>
                <p className="text-base font-bold text-white uppercase">{selectedScam.companyName}</p>
                <p className="text-xs text-cyber-gray mt-0.5">{selectedScam.jobTitle}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Threat Score</p>
                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${
                  selectedScam.fraudScore > 80 ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' : 'bg-yellow-500/25 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {selectedScam.fraudScore}% Probability
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-cyber-blue uppercase tracking-widest">Attack Classification</h5>
              <p className="text-xs text-white bg-[#050811] px-3 py-2.5 rounded-xl border border-cyber-border font-bold">
                {selectedScam.scamType}
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-cyber-pink uppercase tracking-widest">Flagged Threat Vectors</h5>
              <ul className="space-y-2.5">
                {selectedScam.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-cyber-gray leading-relaxed font-semibold">
                    <span className="text-cyber-pink font-bold font-mono">{"[!]"}</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-cyber-border pt-4 mt-6 text-[9px] text-cyber-gray/60 font-mono">
              <span>Incident ID: {selectedScam.id}</span>
              <span>Auditor Node: {selectedScam.reportedBy}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;
