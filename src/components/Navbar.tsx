import React from 'react';
import { Apple, Plus, Presentation, Sparkles, Download, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenPresentation: () => void;
  onToggleSimulator: () => void;
  showSimulator: boolean;
  onExportData: () => void;
  onResetData: () => void;
  childrenCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenPresentation,
  onToggleSimulator,
  showSimulator,
  onExportData,
  onResetData,
  childrenCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E0E7DB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Geometric Brand Logo and Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4A7C44] rounded-lg flex items-center justify-center shadow-xs">
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
                  Community Project
                </span>
              </div>
              <p className="text-xs text-[#7A8676] font-medium hidden sm:block">
                Sundarpur Gram Panchayat • Anganwadi & Primary School Monitor
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Impact Simulator Button */}
            <button
              id="btn-toggle-simulator"
              onClick={onToggleSimulator}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                showSimulator
                  ? 'bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB] ring-2 ring-[#A88B45]/30'
                  : 'bg-white text-[#2D3628] border border-[#E0E7DB] hover:bg-[#F4F7F2]'
              }`}
              title="Test Egg & Milk Community Intervention"
            >
              <Sparkles className="h-4 w-4 text-[#A88B45]" />
              <span className="hidden md:inline">Impact</span> Simulator
            </button>

            {/* Presentation Mode Button */}
            <button
              id="btn-presentation-mode"
              onClick={onOpenPresentation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#1B2A18] hover:bg-[#2D3628] text-white shadow-xs transition-all active:scale-95"
              title="Open Fullscreen Presentation View"
            >
              <Presentation className="h-4 w-4" />
              <span>Presentation Mode</span>
            </button>

            {/* Data Export & Reset Dropdown/Buttons */}
            <button
              id="btn-export-csv"
              onClick={onExportData}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#7A8676] hover:text-[#1B2A18] hover:bg-[#F4F7F2] border border-[#E0E7DB] transition-colors"
              title="Export child nutrition data as CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>

            <button
              id="btn-reset-demo"
              onClick={onResetData}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#7A8676] hover:text-[#1B2A18] hover:bg-[#F4F7F2] border border-[#E0E7DB] transition-colors"
              title="Reset to default village dataset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            {/* Add Child Record */}
            <button
              id="btn-add-child-modal"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#4A7C44] hover:bg-[#3e6839] text-white shadow-xs transition-all active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Child</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
