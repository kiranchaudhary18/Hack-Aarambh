import React, { useState } from 'react';
import { User, Shield, KeyRound, Bell, Mail, Lock, Settings, CheckCircle2, Sparkles } from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@gmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [saveLogs, setSaveLogs] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSuccessMsg('Ecosystem security profile updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 relative z-10">
      
      {/* Title */}
      <div className="border-b border-cyber-border/40 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
          Ecosystem Node Profile
        </h1>
        <p className="text-sm text-cyber-gray mt-2 font-medium">
          Manage secure profile authorization credentials, cryptographic key rotations, and threat logs.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-cyber-glow/10 border border-cyber-glow/20 text-xs text-cyber-glow font-bold flex items-center gap-2 uppercase tracking-wider animate-pulse">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card Left */}
        <div className="md:col-span-1">
          <Card glowColor="cyan" className="p-6 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Profile Avatar"
                className="w-full h-full rounded-2xl object-cover border border-cyber-blue shadow-neon-cyan"
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#03050a] border border-cyber-border rounded-lg text-cyber-glow">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white uppercase">{name}</h3>
              <p className="text-[9px] text-cyber-gray mt-1.5 font-mono font-bold tracking-widest uppercase">ID: SH-8921-NODE</p>
            </div>
            
            <div className="pt-6 border-t border-cyber-border/40 text-xs text-left space-y-4 font-semibold text-cyber-gray">
              <div>
                <p className="text-[9px] text-cyber-gray uppercase font-bold tracking-wider">Ecosystem protection Plan</p>
                <p className="text-white font-bold mt-1 uppercase flex items-center gap-1">
                  <span>Premium Shield Node</span> <Sparkles className="w-3.5 h-3.5 text-cyber-glow" />
                </p>
              </div>
              <div>
                <p className="text-[9px] text-cyber-gray uppercase font-bold tracking-wider">Active Secure Devices</p>
                <p className="text-cyber-glow font-bold mt-1">2 Authorization Points</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Credentials Form Right */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Information */}
          <Card glowColor="purple" className="p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-base uppercase tracking-tight">Identity Parameters</CardTitle>
            </CardHeader>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="profile-name"
                  label="Legal Full Name"
                  type="text"
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  id="profile-email"
                  label="Registered Email Address"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Save Credentials
                </Button>
              </div>
            </form>
          </Card>

          {/* Password Key Rotation */}
          <Card glowColor="pink" className="p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-base uppercase tracking-tight">Key Rotation Vault</CardTitle>
            </CardHeader>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="profile-old-pass"
                  label="Active Password Key"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <Input
                  id="profile-new-pass"
                  label="Rotate New Password Key"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="danger" size="sm">
                  Rotate Security Key
                </Button>
              </div>
            </form>
          </Card>

          {/* Safety alert settings */}
          <Card glowColor="none" className="p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-base uppercase tracking-tight">Vulnerability Monitor settings</CardTitle>
            </CardHeader>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3.5 bg-[#050811] border border-cyber-border rounded-xl cursor-pointer hover:bg-white/3 transition-colors group">
                <div className="text-xs font-semibold">
                  <p className="font-bold text-white uppercase tracking-wide group-hover:text-cyber-glow transition-colors">Instant Threat Warnings</p>
                  <p className="text-cyber-gray mt-1 leading-snug">Dispatch a high-priority warning digest if my scanned PDF matches active blacklists.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailNotif}
                  onChange={() => setEmailNotif(!emailNotif)}
                  className="rounded bg-cyber-dark border-cyber-border text-cyber-blue w-5 h-5 shrink-0" 
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#050811] border border-cyber-border rounded-xl cursor-pointer hover:bg-white/3 transition-colors group">
                <div className="text-xs font-semibold">
                  <p className="font-bold text-white uppercase tracking-wide group-hover:text-cyber-glow transition-colors">Ecosystem log Cache</p>
                  <p className="text-cyber-gray mt-1 leading-snug">Encrypt and cache my sandboxed PDF scans inside private secure ledger index blocks.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={saveLogs}
                  onChange={() => setSaveLogs(!saveLogs)}
                  className="rounded bg-cyber-dark border-cyber-border text-cyber-blue w-5 h-5 shrink-0" 
                />
              </label>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
