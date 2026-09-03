import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { NutritionCharts } from './components/NutritionCharts';
import { ImpactSimulator } from './components/ImpactSimulator';
import { ChildrenTable } from './components/ChildrenTable';
import { ChildModal } from './components/ChildModal';
import { ChildDetailModal } from './components/ChildDetailModal';
import { PresentationMode } from './components/PresentationMode';
import { INITIAL_CHILDREN } from './data/initialData';
import { ChildRecord, NutritionStatus } from './types';
import { calculateVillageStats, analyzeChild } from './utils/nutritionCalculations';
import {
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  HeartHandshake,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'nutrigram_children_v1';

export default function App() {
  // Initialize children from localStorage or fallback to initial dataset
  const [children, setChildren] = useState<ChildRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved children records:', e);
    }
    return INITIAL_CHILDREN;
  });

  const [selectedFilter, setSelectedFilter] = useState<NutritionStatus | 'All'>('All');
  const [showSimulator, setShowSimulator] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState<ChildRecord | null>(null);
  const [selectedChildForView, setSelectedChildForView] = useState<ChildRecord | null>(null);

  // Persist to localStorage whenever children state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(children));
    } catch (e) {
      console.error('Error persisting children records:', e);
    }
  }, [children]);

  // Compute aggregate statistics
  const stats = calculateVillageStats(children);

  // Handler: Add or Update Child
  const handleSaveChild = (
    childData: Omit<ChildRecord, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Update
      setChildren((prev) =>
        prev.map((c) =>
          c.id === existingId
            ? {
                ...c,
                ...childData,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } else {
      // Create new
      const newChild: ChildRecord = {
        ...childData,
        id: `ch-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      setChildren((prev) => [newChild, ...prev]);
    }
  };

  // Handler: Delete Child
  const handleDeleteChild = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
  };

  // Handler: Reset to Initial Data
  const handleResetData = () => {
    if (window.confirm('Reset cohort to initial Sundarpur village records?')) {
      setChildren(INITIAL_CHILDREN);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Child ID',
      'Name',
      'Age',
      'Gender',
      'Height (cm)',
      'Weight (kg)',
      'BMI',
      'BMI Category',
      'Eggs Per Week',
      'Milk Intake',
      'Vegetable Intake',
      'Nutritional Status',
      'Warning Count',
      'Ward',
      'Class/Grade',
    ];

    const rows = children.map((c) => {
      const a = analyzeChild(c);
      return [
        `"${c.id}"`,
        `"${c.name}"`,
        c.age,
        `"${c.gender}"`,
        c.height,
        c.weight,
        a.bmi,
        `"${a.bmiCategory}"`,
        c.eggIntake,
        `"${c.milkIntake}"`,
        `"${c.vegetableIntake}"`,
        `"${a.status}"`,
        a.warningCount,
        `"${c.ward || ''}"`,
        `"${c.schoolGrade || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nutrigram_village_nutrition_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const proteinGoalPct = stats.totalChildren > 0 ? Math.min(100, Math.round((Number(stats.avgEggs) / 3.5) * 100)) : 0;
  const calciumGoalPct = stats.milkOptimalPercent;
  const ironGoalPct = stats.vegetableOptimalPercent;

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#2D3628] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => {
          setChildToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenPresentation={() => setShowPresentation(true)}
        onToggleSimulator={() => setShowSimulator((prev) => !prev)}
        showSimulator={showSimulator}
        onExportData={handleExportCSV}
        onResetData={handleResetData}
        childrenCount={children.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Geometric Balance: Weekly Nutrition Pulse Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E7DB] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left info & location */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold mb-2">
              <span className="flex items-center gap-1 bg-[#F0F4EF] text-[#4A7C44] px-2.5 py-0.5 rounded border border-[#CBD5C0] text-[10px] font-bold uppercase tracking-wider">
                <MapPin className="h-3 w-3 text-[#4A7C44]" /> Sundarpur Village
              </span>
              <span className="flex items-center gap-1 bg-[#F0F4EF] text-[#4A7C44] px-2.5 py-0.5 rounded border border-[#CBD5C0] text-[10px] font-bold uppercase tracking-wider">
                <Calendar className="h-3 w-3 text-[#4A7C44]" /> Phase II Survey
              </span>
              <span className="flex items-center gap-1 bg-[#F0F4EF] text-[#4A7C44] px-2.5 py-0.5 rounded border border-[#CBD5C0] text-[10px] font-bold uppercase tracking-wider">
                <Layers className="h-3 w-3 text-[#4A7C44]" /> Primary School & Anganwadi
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2A18]">
              Weekly Nutrition Pulse
            </h1>
            <p className="text-xs sm:text-sm text-[#7A8676] mt-1.5 leading-relaxed">
              Tracking dietary intake for {children.length} enrolled students against National ICMR-NIN & WHO nutrition thresholds.
            </p>
          </div>

          {/* Center geometric goals */}
          <div className="flex items-center justify-around sm:justify-start gap-6 sm:gap-8 py-3 lg:py-0 border-y lg:border-y-0 lg:border-x border-[#E0E7DB] lg:px-8">
            <div className="text-center">
              <p className="text-3xl font-black text-[#4A7C44]">{proteinGoalPct}%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] mt-0.5">Protein Goal</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-[#A88B45]">{calciumGoalPct}%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] mt-0.5">Calcium Goal</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-[#5C8D89]">{ironGoalPct}%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] mt-0.5">Iron Goal</p>
            </div>
          </div>

          {/* Right presentation & simulator triggers */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setShowPresentation(true)}
              className="px-4 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-white" />
              Launch Presentation Deck
            </button>
            <button
              onClick={() => setShowSimulator((prev) => !prev)}
              className="px-4 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#CBD5C0] transition-colors"
            >
              <HeartHandshake className="h-4 w-4 text-[#A88B45]" />
              {showSimulator ? 'Hide Impact Simulator' : 'Test Community Meal Drive'}
            </button>
          </div>
        </div>

        {/* 4 Hero Stat Cards */}
        <StatCards
          stats={stats}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        {/* Community Impact Simulator (Collapsible) */}
        {showSimulator && (
          <ImpactSimulator
            childrenList={children}
            onClose={() => setShowSimulator(false)}
          />
        )}

        {/* Visual Charts: 3 Nutritional Pillars (Eggs, Milk, Vegetables) */}
        <NutritionCharts childrenList={children} />

        {/* Individual Child Registry & Filterable Table */}
        <ChildrenTable
          childrenList={children}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
          onViewChild={(child) => setSelectedChildForView(child)}
          onEditChild={(child) => {
            setChildToEdit(child);
            setIsAddModalOpen(true);
          }}
          onDeleteChild={handleDeleteChild}
          onOpenAddModal={() => {
            setChildToEdit(null);
            setIsAddModalOpen(true);
          }}
        />
      </main>

      {/* Geometric Balance: Footer */}
      <footer className="bg-[#1B2A18] text-white mt-12 py-5 border-t border-[#2D3628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>Community Vitality Index: Active • {stats.goodCount} Healthy</span>
          <div className="flex flex-wrap items-center gap-6 text-[#CBD5C0]">
            <span>Reporting Period: Q1 2026</span>
            <span>ICMR-NIN Verified</span>
            <a
              href="https://github.com/rohithempire9-hub/Nutrigram"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-white hover:text-[#A88B45] transition-colors tracking-normal capitalize"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChildModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setChildToEdit(null);
        }}
        onSave={handleSaveChild}
        childToEdit={childToEdit}
      />

      <ChildDetailModal
        child={selectedChildForView}
        onClose={() => setSelectedChildForView(null)}
        onEdit={(child) => {
          setSelectedChildForView(null);
          setChildToEdit(child);
          setIsAddModalOpen(true);
        }}
      />

      {showPresentation && (
        <PresentationMode
          childrenList={children}
          stats={stats}
          onClose={() => setShowPresentation(false)}
        />
      )}
    </div>
  );
}
