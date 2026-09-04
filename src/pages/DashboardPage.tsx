import React, { useState } from 'react';
import { ChildRecord, Mandal, NutritionStatus } from '../types';
import { StatCards } from '../components/StatCards';
import { NutritionCharts } from '../components/NutritionCharts';
import { ImpactSimulator } from '../components/ImpactSimulator';
import {
  UserPlus,
  Scale,
  Utensils,
  Building2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Egg,
  Milk,
  Salad,
  CheckCircle2,
} from 'lucide-react';
import { analyzeChild, calculateVillageStats } from '../utils/nutritionCalculations';

interface DashboardPageProps {
  childrenList: ChildRecord[];
  mandals: Mandal[];
  onNavigate: (page: string) => void;
  onSelectChildForFood: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  childrenList,
  mandals,
  onNavigate,
  onSelectChildForFood,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<NutritionStatus | 'All'>('All');
  const [showSimulator, setShowSimulator] = useState(false);

  const stats = calculateVillageStats(childrenList);

  // Urgent triage candidates
  const urgentChildren = childrenList
    .filter((c) => {
      const a = analyzeChild(c);
      return a.status === 'At Risk' || a.bmi < 13.5;
    })
    .slice(0, 4);

  const proteinGoalPct =
    stats.totalChildren > 0
      ? Math.min(100, Math.round((Number(stats.avgEggs) / 3.5) * 100))
      : 0;
  const calciumGoalPct = stats.milkOptimalPercent;
  const ironGoalPct = stats.vegetableOptimalPercent;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Navigation Hub */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
              Gram Panchayat Poshan Abhiyan
            </span>
            <span className="text-xs text-[#7A8676]">Real-time Dynamic Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2A18] mt-1">
            Village Nutrition & Child Health Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8676] mt-1 max-w-2xl">
            Monitoring protein bio-availability, calcium mineralization, and BMI scores across rural school sectors.
          </p>
        </div>

        {/* Quick Multi-Page Route Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigate('records')}
            className="p-3 rounded-xl border border-[#CBD5C0] bg-[#F4F7F2] hover:bg-[#F0F4EF] hover:border-[#4A7C44] transition-all text-left group"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Records</p>
            <p className="text-xs font-bold text-[#1B2A18] group-hover:text-[#4A7C44] mt-0.5">
              Child Census
            </p>
          </button>

          <button
            onClick={() => onNavigate('register')}
            className="p-3 rounded-xl border border-[#CBD5C0] bg-[#F4F7F2] hover:bg-[#F0F4EF] hover:border-[#4A7C44] transition-all text-left group"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Enroll</p>
            <p className="text-xs font-bold text-[#1B2A18] group-hover:text-[#4A7C44] mt-0.5">
              + Add Child
            </p>
          </button>

          <button
            onClick={() => onNavigate('bmi-score')}
            className="p-3 rounded-xl border border-[#CBD5C0] bg-[#F4F7F2] hover:bg-[#FFF9E6] hover:border-[#A88B45] transition-all text-left group"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Clinical</p>
            <p className="text-xs font-bold text-[#1B2A18] group-hover:text-[#A88B45] mt-0.5">
              BMI Score
            </p>
          </button>

          <button
            onClick={() => onNavigate('food-suggestions')}
            className="p-3 rounded-xl border border-[#CBD5C0] bg-[#F4F7F2] hover:bg-[#F0F4EF] hover:border-[#4A7C44] transition-all text-left group"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Therapy</p>
            <p className="text-xs font-bold text-[#1B2A18] group-hover:text-[#4A7C44] mt-0.5">
              Food Menus
            </p>
          </button>
        </div>
      </div>

      {/* Critical Triage Notice if any severe acute malnutrition */}
      {urgentChildren.length > 0 && (
        <div className="bg-[#FFF9E6] border border-[#F3E5AB] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center shrink-0 border border-[#DC2626]/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1B2A18]">Priority Nutrition Interventions</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DC2626] text-white">
                  {urgentChildren.length} Children High Risk
                </span>
              </div>
              <p className="text-xs text-[#7A8676] mt-0.5">
                Students with low egg intake (&le;1/wk) and low vegetable frequency require supplemental Poshan Vatika diet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('bmi-score')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#F4F7F2] text-[#1B2A18] font-bold text-xs border border-[#CBD5C0] transition-colors"
            >
              View BMI Triage
            </button>
            <button
              onClick={() => {
                if (urgentChildren[0]) {
                  onSelectChildForFood(urgentChildren[0].id);
                }
                onNavigate('food-suggestions');
              }}
              className="px-4 py-2 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Prescribe Food</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <StatCards
        stats={stats}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* 3 Pillars of Nutrition Progress Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E7DB] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E0E7DB]">
          <div>
            <h2 className="text-lg font-bold text-[#1B2A18]">
              3 Nutritional Pillars & ICMR-NIN Benchmarks
            </h2>
            <p className="text-xs text-[#7A8676] mt-0.5">
              Target weekly dietary coverage for rural primary school and Anganwadi cohorts.
            </p>
          </div>
          <button
            onClick={() => setShowSimulator((prev) => !prev)}
            className="px-4 py-2 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs border border-[#CBD5C0] transition-colors self-start sm:self-auto"
          >
            {showSimulator ? 'Close Impact Simulator' : 'Test Food Delivery Drive'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Pillar 1: Eggs */}
          <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#A88B45]/15 text-[#A88B45] flex items-center justify-center">
                  <Egg className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1B2A18]">Pillar 1: Complete Protein</p>
                  <p className="text-[10px] text-[#7A8676]">Boiled Eggs Target (&ge;3-4/wk)</p>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-[#A88B45]">{proteinGoalPct}%</span>
            </div>
            <div className="w-full bg-[#E0E7DB] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#A88B45] h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinGoalPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[#7A8676]">
              Cohort average is <strong>{stats.avgEggs} eggs/week</strong>. Eggs provide critical choline for brain and cognitive development.
            </p>
          </div>

          {/* Pillar 2: Milk */}
          <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center">
                  <Milk className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1B2A18]">Pillar 2: Bone Mineralization</p>
                  <p className="text-[10px] text-[#7A8676]">Daily Fortified Milk</p>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-[#3B82F6]">{calciumGoalPct}%</span>
            </div>
            <div className="w-full bg-[#E0E7DB] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#3B82F6] h-full rounded-full transition-all duration-500"
                style={{ width: `${calciumGoalPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[#7A8676]">
              <strong>{stats.milkOptimalPercent}%</strong> receive daily milk. Daily calcium promotes linear height velocity and prevents rickets.
            </p>
          </div>

          {/* Pillar 3: Vegetables */}
          <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4A7C44]/15 text-[#4A7C44] flex items-center justify-center">
                  <Salad className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1B2A18]">Pillar 3: Micronutrient Shield</p>
                  <p className="text-[10px] text-[#7A8676]">Leafy Greens & Moringa</p>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-[#4A7C44]">{ironGoalPct}%</span>
            </div>
            <div className="w-full bg-[#E0E7DB] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#4A7C44] h-full rounded-full transition-all duration-500"
                style={{ width: `${ironGoalPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[#7A8676]">
              <strong>{stats.vegetableOptimalPercent}%</strong> consume greens regularly. Moringa and spinach combat pediatric iron-deficiency anemia.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator (Expandable) */}
      {showSimulator && (
        <ImpactSimulator
          childrenList={childrenList}
          onClose={() => setShowSimulator(false)}
        />
      )}

      {/* Analytical Charts: BMI vs Intake & Age Distribution */}
      <NutritionCharts childrenList={childrenList} />
    </div>
  );
};
