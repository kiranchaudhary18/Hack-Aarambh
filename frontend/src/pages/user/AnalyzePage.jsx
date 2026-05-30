import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, Upload as UploadIcon, Clipboard, Sparkles, AlertCircle, ChevronRight, Terminal } from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Upload from '../../components/ui/Upload';
import Loader from '../../components/ui/Loader';
import { toast } from 'sonner';

const AnalyzePage = () => {
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'text'
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanningPhase, setScanningPhase] = useState(0);
  const navigate = useNavigate();

  const handleScanText = (e) => {
    e.preventDefault();
    if (!textInput.trim()) {
      toast.error('Scan parameter buffer cannot be empty.');
      return;
    }

    setLoading(true);
    toast.info('Initiating sandbox recruitment scan...');

    // Simulate scanning phases
    setTimeout(() => setScanningPhase(1), 800);
    setTimeout(() => setScanningPhase(2), 1600);
    setTimeout(() => setScanningPhase(3), 2400);

    setTimeout(() => {
      setLoading(false);
      setScanningPhase(0);
      toast.success('Forensic audit scan sequence finalized.');
      navigate('/user/result');
    }, 3200);
  };

  const handleUploadFinish = () => {
    setLoading(true);
    toast.info('Decompressing file packet blocks...');

    setTimeout(() => setScanningPhase(1), 1000);
    setTimeout(() => setScanningPhase(2), 2000);
    setTimeout(() => setScanningPhase(3), 3000);

    setTimeout(() => {
      setLoading(false);
      setScanningPhase(0);
      toast.success('Document validation completed.');
      navigate('/user/result');
    }, 4000);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto relative z-10">
      
      {/* Title */}
      <div className="border-b border-cyber-border/40 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
          AI Integrity Sandbox
        </h1>
        <p className="text-sm text-cyber-gray mt-2 font-medium">
          Sandbox terminal evaluating contract metadata, domain lookalikes, and pressure vectors.
        </p>
      </div>

      {loading ? (
        <Card glowColor="cyan" className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Loader progress={scanningPhase * 33.3} />
          <div className="mt-8 space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider animate-pulse">Running Threat Forensics</h3>
            <p className="text-xs text-cyber-gray max-w-xs font-semibold leading-relaxed">
              {scanningPhase === 0 ? "Decompressing text character blocks..." :
               scanningPhase === 1 ? "Checking recruitment sender domain DNS registries..." :
               scanningPhase === 2 ? "Auditing contract equipment check values..." :
               "Compiling final threat intelligence profile..."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Tab Selector buttons */}
          <div className="flex gap-4 p-1.5 rounded-2xl bg-[#060a12] border border-cyber-border w-fit">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'pdf' 
                  ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-black shadow-neon-cyan/20' 
                  : 'text-cyber-gray hover:text-white'
              }`}
            >
              <UploadIcon className="w-4 h-4" /> PDF Document Scan
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'text' 
                  ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-black shadow-neon-cyan/20' 
                  : 'text-cyber-gray hover:text-white'
              }`}
            >
              <Clipboard className="w-4 h-4" /> Recruit Text Parse
            </button>
          </div>

          {/* PDF Mode Upload Component */}
          {activeTab === 'pdf' && (
            <Card glowColor="purple" className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Drop Recruitment Contract</h3>
                <p className="text-xs text-cyber-gray font-semibold mt-1">Upload the recruitment PDF for deep metadata extraction.</p>
              </div>

              <Upload onUploadComplete={handleUploadFinish} />
              
              <div className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-white/3 border border-cyber-border text-xs text-cyber-gray leading-relaxed font-semibold">
                <AlertCircle className="w-5 h-5 text-cyber-blue shrink-0 mt-0.5" />
                <p>
                  Documents are evaluated inside a secure, encrypted virtual container. SafeHire does not index your private details.
                </p>
              </div>
            </Card>
          )}

          {/* Text Mode Paste Form */}
          {activeTab === 'text' && (
            <Card glowColor="purple" className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Paste Recruiting Communication</h3>
                <p className="text-xs text-cyber-gray font-semibold mt-1">Copy and paste emails, text chats, or contract clauses to audit linguistic anomalies.</p>
              </div>

              <form onSubmit={handleScanText} className="space-y-6">
                <div className="relative">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste chat interactions, email headers, or suspicious recruitment requirements here..."
                    className="w-full h-48 px-4 py-4 bg-[#050811] text-white rounded-xl border border-cyber-border/80 focus:border-cyber-blue/50 focus:outline-none focus:shadow-[0_0_20px_rgba(0,242,254,0.15)] transition-all duration-300 font-mono text-xs placeholder:text-gray-700 leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[9px] text-cyber-gray uppercase font-bold tracking-widest bg-[#03060c] px-2.5 py-1.5 rounded-lg border border-cyber-border">
                    <Terminal className="w-3 h-3 text-cyber-blue" /> Sandbox Node
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="font-bold uppercase tracking-wider"
                    icon={ChevronRight}
                    iconPosition="right"
                  >
                    Perform Text Audit
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
