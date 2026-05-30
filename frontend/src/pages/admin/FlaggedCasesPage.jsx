import React, { useState } from 'react';
import { ShieldAlert, Globe, Trash2, Plus, CheckCircle2, ShieldOff, Search, Link as LinkIcon, Sparkles } from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const FlaggedCasesPage = () => {
  const [blacklist, setBlacklist] = useState([
    { id: 1, type: 'domain', value: 'globaltech-hr-desk.com', reason: 'Advance Fee Check Phishing', dateAdded: '2026-05-24', author: 'Sarah Chen' },
    { id: 2, type: 'email', value: 'vendor@globaltech-equipments.com', reason: 'Zelle/Bitcoin Equipment purchase scam', dateAdded: '2026-05-23', author: 'System Node' },
    { id: 3, type: 'domain', value: 'amazon-recruitment-signal.com', reason: 'Identity harvesting / telegram chat phishing', dateAdded: '2026-05-22', author: 'Sarah Chen' },
    { id: 4, type: 'email', value: 'careers@meta-hiring-hr.org', reason: 'Lookalike recruiter domain impersonating Meta', dateAdded: '2026-05-20', author: 'System Node' }
  ]);

  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState('domain');
  const [newReason, setNewReason] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newValue || !newReason) return;

    const newItem = {
      id: Date.now(),
      type: newType,
      value: newValue,
      reason: newReason,
      dateAdded: new Date().toISOString().split('T')[0],
      author: 'Sarah Chen'
    };

    setBlacklist([newItem, ...blacklist]);
    setNewValue('');
    setNewReason('');
    setSuccess('Ecosystem Blacklist warning rule published successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id) => {
    setBlacklist(blacklist.filter(item => item.id !== id));
  };

  const filteredList = blacklist.filter(item => 
    item.value.toLowerCase().includes(search.toLowerCase()) ||
    item.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-5xl mx-auto relative z-10">
      
      {/* Title */}
      <div className="border-b border-cyber-border/40 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
          Ecosystem Threat Blacklist
        </h1>
        <p className="text-sm text-cyber-gray mt-2 font-medium">
          Configure and publish domain blacklists, fraudulent recruiter addresses, and lookalike brand identities.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-cyber-glow/10 border border-cyber-glow/20 text-xs text-cyber-glow font-bold flex items-center gap-2 uppercase tracking-wider animate-pulse">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Publish form */}
        <div className="lg:col-span-1">
          <Card glowColor="pink" className="p-6">
            <CardHeader className="mb-6">
              <div>
                <CardTitle className="text-base uppercase tracking-tight">Publish Warning Rule</CardTitle>
                <CardDescription className="text-xs">Propagate real-time endpoint warning indicators across candidates nodes.</CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-cyber-gray block mb-1 uppercase tracking-wider">Warning Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#050811] text-white rounded-xl border border-cyber-border focus:border-cyber-blue focus:outline-none transition-all duration-300 text-xs font-semibold"
                >
                  <option value="domain">Spoofed Domain Check</option>
                  <option value="email">Fraudulent Recruiter Mail</option>
                  <option value="company">Impersonated Enterprise Name</option>
                </select>
              </div>

              <Input
                id="block-value"
                label="Anomaly Target Parameter"
                type="text"
                placeholder={newType === 'domain' ? 'e.g. google-recruitment-team.com' : 'e.g. recruit@meta-careers-net.org'}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                required
              />

              <Input
                id="block-reason"
                label="Audit Anomaly Reason"
                type="text"
                placeholder="e.g. Lookalike domain with check phishing flags"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="danger"
                className="w-full text-xs font-bold mt-2"
                icon={Plus}
              >
                Publish Rule
              </Button>
            </form>
          </Card>
        </div>

        {/* Database List Right */}
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full">
            <Input
              id="search-blacklist"
              type="text"
              placeholder="Query warning domains/recruiter signatures..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Card glowColor="purple" className="p-6">
            <CardHeader className="mb-6">
              <div>
                <CardTitle className="text-base uppercase tracking-tight">Ecosystem Ledger Warning Rules</CardTitle>
              </div>
            </CardHeader>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-[11px] leading-normal">
                <thead>
                  <tr className="border-b border-cyber-border/40 text-cyber-gray font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Designated Parameter</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Audit Flags Description</th>
                    <th className="pb-3">Added Date</th>
                    <th className="pb-3 pr-2 text-right">Revoke</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/20">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-all">
                      <td className="py-4 pl-2 font-mono font-bold text-white flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-cyber-pink shrink-0" />
                        <span className="truncate max-w-[150px]">{item.value}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
                          item.type === 'domain' ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30' : 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 text-cyber-gray font-semibold max-w-[150px] truncate">
                        {item.reason}
                      </td>
                      <td className="py-4 text-cyber-gray/70 font-mono">
                        {item.dateAdded}
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-cyber-pink/10 hover:bg-cyber-pink hover:text-white border border-cyber-pink/20 transition-all text-cyber-pink cursor-pointer"
                          title="Revoke Blacklist Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-cyber-gray font-semibold uppercase tracking-wider">
                        No flagged items registered in ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default FlaggedCasesPage;
