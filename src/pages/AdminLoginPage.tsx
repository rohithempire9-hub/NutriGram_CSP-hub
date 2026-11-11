import React, { useState } from 'react';
import { AuthUser } from '../types';
import { loginAdmin } from '../lib/api';
import {
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  LogOut,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Loader2,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!username.trim() || !password) {
      setError('Enter your administrator username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await loginAdmin(username.trim(), password);
      onLogin(user);
      setSuccessMsg('Administrator authenticated successfully.');
      setPassword('');
      window.setTimeout(() => onNavigate('dashboard'), 500);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4A7C44] text-white flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1B2A18]">
              NutriGram Administrator Login
            </h1>
            <p className="text-xs sm:text-sm text-[#7A8676] mt-1">
              Secure access to child nutrition records and Mandal management.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#F0F4EF] border border-[#4A7C44] text-[#1B2A18] flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-[#4A7C44]" />
          <span>{successMsg}</span>
        </div>
      )}

      {currentUser ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs space-y-6">
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E0E7DB]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A7C44]">
                Authenticated administrator
              </span>
              <h2 className="text-xl font-bold text-[#1B2A18] mt-1">{currentUser.name}</h2>
              <p className="text-xs text-[#7A8676]">Username: @{currentUser.username}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#DC2626] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#CBD5C0]"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
          <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
            <p className="text-xs font-bold text-[#1B2A18]">Secure session active</p>
            <p className="text-xs text-[#7A8676] mt-1">
              Your session is held in an HttpOnly cookie and is not stored in browser localStorage.
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs sm:text-sm flex items-center gap-2"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs">
          <h2 className="text-lg font-bold text-[#1B2A18] mb-1">Sign in to your account</h2>
          <p className="text-xs text-[#7A8676] mb-6">
            Only the configured NutriGram administrator account can access stored records.
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
                Administrator username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-[#7A8676]" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5C0] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44] text-sm text-[#1B2A18] bg-[#F4F7F2]/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B2A18] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#7A8676]" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5C0] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44] text-sm text-[#1B2A18] bg-[#F4F7F2]/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] disabled:opacity-60 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {isSubmitting ? 'Authenticating...' : 'Sign In to NutriGram'}
            </button>
          </form>

          <p className="text-[11px] leading-relaxed text-[#7A8676] mt-5">
            Demo logins have been disabled. Configure the administrator credentials securely in the backend environment before signing in.
          </p>
        </div>
      )}
    </div>
  );
};
