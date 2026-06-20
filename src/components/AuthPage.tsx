import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Leaf, KeyRound, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: { userId: string; email: string; displayName: string; }) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSignUp ? { email, password, displayName } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication sequence failed.');
      }

      // Success
      if (data.user) {
        onAuthSuccess({
          userId: data.user.userId,
          email: data.user.email,
          displayName: data.user.displayName,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Verification rejected.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onAuthSuccess({
      userId: 'user_digital_twin_1',
      email: 'alex.carter@netzero.org',
      displayName: 'Alex Carter',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-zinc-950 font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-zinc-950 font-mono font-extrabold text-lg shadow-xl mb-4">
            <Leaf className="w-6 h-6 text-zinc-950 fill-zinc-950" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider font-sans uppercase">EcoTwin Intelligence</h1>
          <p className="text-xs text-zinc-400 font-mono tracking-widest mt-1.5 uppercase">Digital Twin Modeling Platform</p>
        </div>

        {/* Card Frame */}
        <motion.div 
          layout
          className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top segment tabs */}
          <div className="flex border-b border-zinc-800 mb-6 pb-2">
            <button
              onClick={() => { setIsSignUp(false); setError(null); }}
              className={`flex-1 text-center py-2 text-xs font-bold font-mono uppercase tracking-wider transition ${!isSignUp ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              id="signin-tab-btn"
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(null); }}
              className={`flex-1 text-center py-2 text-xs font-bold font-mono uppercase tracking-wider transition ${isSignUp ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              id="signup-tab-btn"
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, x: isSignUp ? 15 : -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -15 : 15 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSubmit}
              className="space-y-4"
              id="auth-form"
            >
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Display Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Alex Carter"
                      className="w-full bg-zinc-950/60 border border-zinc-805 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 font-mono transition"
                      id="auth-name-input"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.org"
                    className="w-full bg-zinc-950/60 border border-zinc-805 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 font-mono transition"
                    id="auth-email-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/60 border border-zinc-805 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 font-mono transition"
                    id="auth-password-input"
                  />
                </div>
              </div>

              {/* Error readout */}
              {error && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/10 text-xs text-red-400 flex items-start gap-2.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition shadow-lg flex items-center justify-center gap-2"
                id="auth-submit-btn"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    {isSignUp ? 'Generate Carbon-Twin' : 'Decrypt Dashboard'}
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-zinc-800" />
            <span className="flex-shrink mx-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">OR SECURE RECRUITER MODE</span>
            <div className="flex-grow border-t border-zinc-800" />
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-zinc-950/50 border border-zinc-840 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 font-mono text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
            id="auth-demo-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Launch Showcase (Alex Carter)
          </button>
        </motion.div>

        {/* Policy footer */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-zinc-600 font-mono leading-relaxed">
            Data persists securely inside your workspace session database.<br />
            Compliant with standard carbon-computational protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
