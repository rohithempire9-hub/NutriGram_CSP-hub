import React, { useState } from 'react';
import { AuthUser } from '../types';
import {
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  LogOut,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface AdminLoginPageProps {
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username or ID');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Authenticate credentials
    const lowerUser = username.trim().toLowerCase();
    if (lowerUser === 'admin' || lowerUser === 'supervisor' || lowerUser === 'officer' || password.length >= 4) {
      const user: AuthUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        username: username.trim(),
        name:
          lowerUser === 'admin'
            ? 'State Poshan Officer'
            : lowerUser === 'supervisor'
            ? 'Smt. Lakshmi Devi (Supervisor)'
            : `${username.trim()} (Anganwadi Admin)`,
        role: lowerUser === 'admin' ? 'admin' : 'supervisor',
        mandalJurisdiction: 'All Mandals (District Level)',
        token: `token-jwt-${Math.random().toString(36).substring(2, 10)}`,
      };
      onLogin(user);
      setSuccessMsg(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } else {
      setError('Invalid credentials. You can use the 1-Click Demo Logins below.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'supervisor' | 'medical_officer') => {
    let user: AuthUser;
    if (role === 'admin') {
      user = {
        id: 'usr-admin-01',
        username: 'admin.poshan',
        name: 'Dr. R. K. Sharma (Project Director)',
        role: 'admin',
        mandalJurisdiction: 'All 4 Mandals (Chittoor / Annamayya)',
        token: 'token-jwt-admin-session',
      };
    } else if (role === 'medical_officer') {
      user = {
        id: 'usr-mo-02',
        username: 'medical.officer',
        name: 'Dr. A. Sudhakar (Block Medical Officer)',
        role: 'medical_officer',
        mandalJurisdiction: 'Kuppam & Palamaner Health Blocks',
        token: 'token-jwt-mo-session',
      };
    } else {
      user = {
        id: 'usr-sup-03',
        username: 'anganwadi.supervisor',
        name: 'Smt. Lakshmi Devi (Anganwadi Supervisor)',
        role: 'supervisor',
        mandalJurisdiction: 'Kuppam Mandal (Sector 4)',
        token: 'token-jwt-supervisor-session',
      };
    }

    onLogin(user);
    setSuccessMsg(`Logged in successfully as ${user.name}!`);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#4A7C44] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#1B2A18]">
                  Administrator & Supervisor Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
                  Role-Based Auth
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#7A8676] mt-1">
                Secure access for Anganwadi supervisors, Block Medical Officers, and Gram Panchayat CDPOs.
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 bg-[#F0F4EF] text-[#1B2A18] px-3.5 py-2 rounded-xl border border-[#CBD5C0]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4A7C44] animate-pulse" />
              <span className="text-xs font-bold">Active Session</span>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-[#F0F4EF] border border-[#4A7C44] text-[#1B2A18] flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-[#4A7C44]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Active User Session Details if already logged in */}
      {currentUser ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-[#E0E7DB]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88B45]">
                Currently Authenticated
              </span>
              <h2 className="text-xl font-bold text-[#1B2A18] mt-0.5">{currentUser.name}</h2>
              <p className="text-xs text-[#7A8676]">Username: @{currentUser.username}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#DC2626] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#CBD5C0] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Role Permission</p>
              <p className="text-sm font-bold text-[#1B2A18] mt-1 capitalize">{currentUser.role.replace('_', ' ')}</p>
              <p className="text-xs text-[#7A8676] mt-0.5">Full Add/Edit/Delete access</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Jurisdiction</p>
              <p className="text-sm font-bold text-[#1B2A18] mt-1">{currentUser.mandalJurisdiction || 'All Mandals'}</p>
              <p className="text-xs text-[#7A8676] mt-0.5">Gram Panchayat Area</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Session Token</p>
              <p className="text-xs font-mono font-bold text-[#4A7C44] mt-1 truncate">
                {currentUser.token || 'Bearer Auth Active'}
              </p>
              <p className="text-xs text-[#7A8676] mt-0.5">Stored in LocalStorage</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('records')}
              className="px-5 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <span>Manage Child Records</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-5 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs sm:text-sm border border-[#CBD5C0] transition-colors"
            >
              Add New Child
            </button>
            <button
              onClick={() => onNavigate('mandals')}
              className="px-5 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs sm:text-sm border border-[#CBD5C0] transition-colors"
            >
              Manage Mandals
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Standard Credentials Login */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs">
            <h2 className="text-lg font-bold text-[#1B2A18] mb-1">Sign In to Your Account</h2>
            <p className="text-xs text-[#7A8676] mb-6">
              Enter your government or Anganwadi project credentials to authenticate.
            </p>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] flex items-center gap-2.5 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1B2A18] mb-1.5 uppercase tracking-wider">
                  Username or Official ID
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-[#7A8676]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. supervisor.lakshmi or admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5C0] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44] text-sm text-[#1B2A18] bg-[#F4F7F2]/50 placeholder:text-[#7A8676]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2A18] mb-1.5 uppercase tracking-wider">
                  Password / PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#7A8676]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (minimum 4 characters)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5C0] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44] text-sm text-[#1B2A18] bg-[#F4F7F2]/50 placeholder:text-[#7A8676]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-sm shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  Sign In to NutriGram
                </button>
              </div>
            </form>
          </div>

          {/* Right Cards: 1-Click Demo Profiles */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-xs">
              <h3 className="text-sm font-bold text-[#1B2A18] mb-1">Instant Demo Logins</h3>
              <p className="text-xs text-[#7A8676] mb-4">
                Click any persona below to authenticate instantly with preset permissions.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('supervisor')}
                  className="w-full text-left p-3.5 rounded-xl border border-[#CBD5C0] hover:border-[#4A7C44] bg-[#F4F7F2] hover:bg-[#F0F4EF] transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1B2A18] group-hover:text-[#4A7C44]">
                      Anganwadi Supervisor
                    </p>
                    <p className="text-[11px] text-[#7A8676]">Smt. Lakshmi Devi • Kuppam Mandal</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4A7C44]/10 text-[#4A7C44] border border-[#4A7C44]/30">
                    Use
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('medical_officer')}
                  className="w-full text-left p-3.5 rounded-xl border border-[#CBD5C0] hover:border-[#A88B45] bg-[#F4F7F2] hover:bg-[#FFF9E6] transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1B2A18] group-hover:text-[#A88B45]">
                      Block Medical Officer
                    </p>
                    <p className="text-[11px] text-[#7A8676]">Dr. A. Sudhakar • PHC In-charge</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#A88B45]/10 text-[#A88B45] border border-[#A88B45]/30">
                    Use
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="w-full text-left p-3.5 rounded-xl border border-[#CBD5C0] hover:border-[#1B2A18] bg-[#F4F7F2] hover:bg-white transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1B2A18]">
                      District Poshan Director
                    </p>
                    <p className="text-[11px] text-[#7A8676]">Dr. R. K. Sharma • All Mandals</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1B2A18]/10 text-[#1B2A18] border border-[#1B2A18]/30">
                    Use
                  </span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF9E6] border border-[#F3E5AB] text-xs text-[#A88B45]">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldAlert className="h-4 w-4" />
                <span>Role Security Notice</span>
              </div>
              <p className="text-[11px] text-[#7A8676] leading-relaxed">
                Supervisors and administrators can add and edit children, configure Mandal jurisdictions, and export verified reports.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
