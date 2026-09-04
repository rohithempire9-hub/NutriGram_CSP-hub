import React, { useState } from 'react';
import { ChildRecord, Mandal } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';
import {
  Activity,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Scale,
  Ruler,
  ArrowRight,
  Info,
  Layers,
} from 'lucide-react';

interface BmiScorePageProps {
  childrenList: ChildRecord[];
  mandals: Mandal[];
  onSelectChildForFood: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const BmiScorePage: React.FC<BmiScorePageProps> = ({
  childrenList,
  mandals,
  onSelectChildForFood,
  onNavigate,
}) => {
  // Quick Calculator state
  const [calcHeight, setCalcHeight] = useState<number>(115);
  const [calcWeight, setCalcWeight] = useState<number>(18);
  const [calcAge, setCalcAge] = useState<number>(7);

  // Filter children by mandal
  const [selectedMandal, setSelectedMandal] = useState<string>('All');

  // Compute calculated BMI
  const calcHeightMeters = calcHeight > 0 ? calcHeight / 100 : 1;
  const computedBmi =
    calcHeightMeters > 0 ? Number((calcWeight / (calcHeightMeters * calcHeightMeters)).toFixed(1)) : 0;

  let computedCategory = 'Normal';
  let categoryColor = 'text-[#4A7C44] bg-[#F0F4EF] border-[#CBD5C0]';

  if (computedBmi < 13.0) {
    computedCategory = 'Severely Underweight (SAM)';
    categoryColor = 'text-[#DC2626] bg-[#FEF2F2] border-[#DC2626]/40';
  } else if (computedBmi < 14.5) {
    computedCategory = 'Underweight (MAM)';
    categoryColor = 'text-[#A88B45] bg-[#FFF9E6] border-[#F3E5AB]';
  } else if (computedBmi > 18.0) {
    computedCategory = 'Overweight';
    categoryColor = 'text-[#3B82F6] bg-[#EFF6FF] border-[#BFDBFE]';
  }

  // Filter children
  const displayedChildren =
    selectedMandal === 'All'
      ? childrenList
      : childrenList.filter(
          (c) => c.mandalName === selectedMandal || c.mandalId === selectedMandal
        );

  // Group into BMI buckets
  const severelyUnderweight = displayedChildren.filter((c) => {
    const bmi = c.weight / ((c.height / 100) * (c.height / 100));
    return bmi < 13.0;
  });

  const underweight = displayedChildren.filter((c) => {
    const bmi = c.weight / ((c.height / 100) * (c.height / 100));
    return bmi >= 13.0 && bmi < 14.5;
  });

  const normalWeight = displayedChildren.filter((c) => {
    const bmi = c.weight / ((c.height / 100) * (c.height / 100));
    return bmi >= 14.5 && bmi <= 18.0;
  });

  const overweight = displayedChildren.filter((c) => {
    const bmi = c.weight / ((c.height / 100) * (c.height / 100));
    return bmi > 18.0;
  });

  const avgCohortBmi =
    displayedChildren.length > 0
      ? (
          displayedChildren.reduce((acc, c) => {
            const h = c.height / 100;
            return acc + c.weight / (h * h);
          }, 0) / displayedChildren.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
              Anthropometric Clinical Metrics
            </span>
            <span className="text-xs text-[#7A8676]">WHO Pediatric Reference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2A18] mt-1">
            Child BMI Score & Growth Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8676] mt-1 max-w-2xl">
            Evaluate Body Mass Index (BMI-for-age) across rural cohorts. Quickly identify stunting, severe acute malnutrition (SAM), and recovery progress.
          </p>
        </div>

        <div className="bg-[#F4F7F2] px-4 py-2.5 rounded-xl border border-[#CBD5C0] text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Cohort Mean BMI</p>
          <p className="text-2xl font-black text-[#4A7C44] font-mono">{avgCohortBmi}</p>
        </div>
      </div>

      {/* Top Split: Interactive Quick Calculator + WHO Reference Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Calculator */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E0E7DB]">
            <Calculator className="h-5 w-5 text-[#4A7C44]" />
            <h2 className="text-base font-bold text-[#1B2A18]">Interactive Child BMI Calculator</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                Height (cm)
              </label>
              <input
                type="number"
                value={calcHeight}
                onChange={(e) => setCalcHeight(Number(e.target.value))}
                min={60}
                max={190}
                className="w-full px-3 py-2 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-mono focus:border-[#4A7C44]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                min={5}
                max={90}
                className="w-full px-3 py-2 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-mono focus:border-[#4A7C44]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                Age (Years)
              </label>
              <input
                type="number"
                value={calcAge}
                onChange={(e) => setCalcAge(Number(e.target.value))}
                min={1}
                max={18}
                className="w-full px-3 py-2 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-mono focus:border-[#4A7C44]"
              />
            </div>
          </div>

          {/* Calculator Result Card */}
          <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Calculated Score</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-[#1B2A18] font-mono">{computedBmi}</span>
                <span className="text-xs text-[#7A8676]">kg/m²</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold border ${categoryColor}`}>
                {computedCategory}
              </span>
              <p className="text-[10px] text-[#7A8676] mt-1">
                {computedBmi < 14.5 ? 'Immediate Egg & Milk Therapy Prescribed' : 'Healthy Pediatric Growth'}
              </p>
            </div>
          </div>
        </div>

        {/* WHO Reference Table */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E0E7DB]">
            <Info className="h-5 w-5 text-[#A88B45]" />
            <h2 className="text-base font-bold text-[#1B2A18]">WHO Indian Pediatric Classifications</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E0E7DB]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7F2] text-[#7A8676] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">BMI Range</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">Clinical Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E7DB] text-[#2D3628]">
                <tr>
                  <td className="py-2 px-3 font-mono font-bold text-[#DC2626]">&lt; 13.0</td>
                  <td className="py-2 px-3 font-bold text-[#DC2626]">Severe Acute Malnutrition</td>
                  <td className="py-2 px-3 text-[11px]">Daily 2 eggs, 200ml milk, NRC referral</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold text-[#A88B45]">13.0 - 14.4</td>
                  <td className="py-2 px-3 font-bold text-[#A88B45]">Moderate Underweight</td>
                  <td className="py-2 px-3 text-[11px]">3-4 eggs/wk + peanut jaggery laddu</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold text-[#4A7C44]">14.5 - 17.9</td>
                  <td className="py-2 px-3 font-bold text-[#4A7C44]">Normal Healthy Weight</td>
                  <td className="py-2 px-3 text-[11px]">Standard Mid-Day meal & vegetables</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold text-[#3B82F6]">&ge; 18.0</td>
                  <td className="py-2 px-3 font-bold text-[#3B82F6]">Overweight / Elevated</td>
                  <td className="py-2 px-3 text-[11px]">Physical play & balanced greens</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mandal Filter Selector */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E7DB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#4A7C44]" />
          <span className="text-xs font-bold text-[#1B2A18] uppercase tracking-wider">
            Filter Cohort by Mandal:
          </span>
          <select
            value={selectedMandal}
            onChange={(e) => setSelectedMandal(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#CBD5C0] text-xs font-semibold text-[#1B2A18] bg-[#F4F7F2]"
          >
            <option value="All">All Mandals ({childrenList.length} children)</option>
            {mandals.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-[#7A8676]">
          Displaying analysis for <span className="font-bold text-[#1B2A18]">{displayedChildren.length}</span> students
        </p>
      </div>

      {/* 4 Geometric Distribution Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DC2626]/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">
              Severe SAM (&lt;13.0)
            </span>
            <TrendingDown className="h-4 w-4 text-[#DC2626]" />
          </div>
          <p className="text-3xl font-black text-[#DC2626] mt-2 font-mono">{severelyUnderweight.length}</p>
          <p className="text-xs text-[#7A8676] mt-1">Critical intervention cohort</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#A88B45]/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88B45]">
              Moderate MAM (13-14.4)
            </span>
            <AlertTriangle className="h-4 w-4 text-[#A88B45]" />
          </div>
          <p className="text-3xl font-black text-[#A88B45] mt-2 font-mono">{underweight.length}</p>
          <p className="text-xs text-[#7A8676] mt-1">Needs supplemental ration</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#4A7C44]/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A7C44]">
              Normal (14.5 - 17.9)
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#4A7C44]" />
          </div>
          <p className="text-3xl font-black text-[#4A7C44] mt-2 font-mono">{normalWeight.length}</p>
          <p className="text-xs text-[#7A8676] mt-1">Healthy growth trajectory</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#3B82F6]/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6]">
              Overweight (&ge;18.0)
            </span>
            <TrendingUp className="h-4 w-4 text-[#3B82F6]" />
          </div>
          <p className="text-3xl font-black text-[#3B82F6] mt-2 font-mono">{overweight.length}</p>
          <p className="text-xs text-[#7A8676] mt-1">Upper percentile threshold</p>
        </div>
      </div>

      {/* Children Requiring BMI Rehabilitation Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1B2A18]">
              Children Identified with Underweight BMI (&lt; 14.5)
            </h3>
            <p className="text-xs text-[#7A8676]">
              Immediate candidates for egg, milk, and high-calorie peanut laddu intervention.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30">
            {severelyUnderweight.length + underweight.length} Priority Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F7F2] text-[#7A8676] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Age / Gender</th>
                <th className="py-2.5 px-3">Mandal</th>
                <th className="py-2.5 px-3">Height & Weight</th>
                <th className="py-2.5 px-3 text-center">BMI Score</th>
                <th className="py-2.5 px-3">Weekly Eggs</th>
                <th className="py-2.5 px-3">Diet Prescription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E7DB] text-[#2D3628]">
              {[...severelyUnderweight, ...underweight].map((child) => {
                const a = analyzeChild(child);
                return (
                  <tr key={child.id} className="hover:bg-[#F4F7F2]/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#1B2A18]">{child.name}</td>
                    <td className="py-2.5 px-3">
                      {child.age} yrs • <span className="capitalize">{child.gender}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#7A8676]">{child.mandalName || 'Kuppam Mandal'}</td>
                    <td className="py-2.5 px-3 font-mono">
                      {child.height} cm / {child.weight} kg
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          a.bmi < 13.0
                            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30'
                            : 'bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]'
                        }`}
                      >
                        {a.bmi}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#A88B45]">
                      {child.eggIntake} / wk
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => {
                          onSelectChildForFood(child.id);
                          onNavigate('food-suggestions');
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#4A7C44] hover:text-[#3e6839] hover:underline"
                      >
                        <span>View Food Menu</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
