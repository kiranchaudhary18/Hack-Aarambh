import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-6 relative overflow-hidden text-center">
      {/* Background Decor */}
      <div className="ambient-blob blur-blob blob-cyan absolute top-[-10%] left-[-10%] w-[450px] h-[450px] pointer-events-none" />
      <div className="ambient-blob blur-blob blob-purple absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] pointer-events-none" />
      <div className="particles-decor" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="p-4 bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20 rounded-full w-fit mx-auto animate-pulse">
          <ShieldOff className="w-12 h-12" />
        </div>

        <h1 className="text-7xl font-black text-white font-mono tracking-wider leading-none">
          404
        </h1>

        <Card glowColor="pink" className="p-8">
          <CardTitle className="text-lg uppercase tracking-tight">Security Node Address Unresolved</CardTitle>
          <CardDescription className="text-xs mt-3 leading-relaxed font-semibold">
            The security address or route parameter you requested does not exist or has been relocated by active system administrators under compliance updates.
          </CardDescription>
        </Card>

        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              Return Home
            </Button>
          </Link>
          <Link to="/user/dashboard">
            <Button variant="primary" size="sm" icon={Home}>
              To Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
