import React, { useState } from 'react';
import { ActivePage, AuthUser } from '../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Scale,
  Utensils,
  Building2,
  ShieldCheck,
  Presentation,
  Menu,
  X,
  Sparkles,
  Download,
  LogOut,
  User,
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser: AuthUser | null;
  onOpenPresentation: () => void;
  onExportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  currentUser,
  onOpenPresentation,
  onExportData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'records' as ActivePage,
      label: 'Child Records',
      icon: Users,
    },
    {
      id: 'register' as ActivePage,
      label: 'Add Child',
      icon: UserPlus,
    },
    {
      id: 'bmi-score' as ActivePage,
      label: 'BMI Score',
      icon: Scale,
    },
    {
      id: 'food-suggestions' as ActivePage,
      label: 'Food Suggestions',
      icon: Utensils,
    },
    {
      id: 'mandals' as ActivePage,
      label: 'Mandals',
      icon: Building2,
    },
    {
      id: 'admin-login' as ActivePage,
      label: currentUser ? 'Auth Profile' : 'Admin Login',
      icon: ShieldCheck,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E0E7DB] shadow-xs">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-[#4A7C44] rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#1B2A18] uppercase">
                  NUTRIGRAM
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
                  Rural Poshan
                </span>
              </div>
              <p className="text-[11px] text-[#7A8676] font-medium hidden sm:block">
                Village School Nutrition & Mandal Health System
              </p>
            </div>
          </div>

          {/* Desktop Right Utilities */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Presentation Mode */}
            <button
              onClick={onOpenPresentation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1B2A18] hover:bg-[#2D3628] text-white shadow-xs transition-all active:scale-95"
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>Presentation</span>
            </button>

            {/* Auth Pill Button */}
            <button
              onClick={() => onNavigate('admin-login')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                currentUser
                  ? 'bg-[#F0F4EF] border-[#4A7C44] text-[#4A7C44]'
                  : 'bg-white border-[#CBD5C0] text-[#1B2A18] hover:bg-[#F4F7F2]'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Admin Sign In'}</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('admin-login')}
              className="p-2 rounded-xl text-xs font-bold bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1B2A18] hover:bg-[#F4F7F2] border border-[#CBD5C0]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Primary Page Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-1 -mb-px border-t border-[#E0E7DB]/80 pt-1 pb-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#4A7C44] text-white shadow-xs'
                    : 'text-[#2D3628] hover:text-[#1B2A18] hover:bg-[#F4F7F2]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#7A8676]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E0E7DB] px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-[#4A7C44] text-white'
                    : 'text-[#2D3628] hover:bg-[#F4F7F2]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#E0E7DB] flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenPresentation();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-xl bg-[#1B2A18] text-white text-xs font-bold text-center"
            >
              Presentation Mode
            </button>
            <button
              onClick={() => {
                onExportData();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl bg-[#F0F4EF] text-[#1B2A18] text-xs font-bold border border-[#CBD5C0]"
            >
              Export CSV
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
