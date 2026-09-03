import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Egg, Milk, Salad, Activity, Info, Sparkles, TrendingUp } from 'lucide-react';
import { ChildRecord } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';

interface NutritionChartsProps {
  childrenList: ChildRecord[];
}

export const NutritionCharts: React.FC<NutritionChartsProps> = ({ childrenList }) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'deficits' | 'who_comparison'>('pillars');

  const total = childrenList.length || 1;

  // 1. Egg distribution calculations
  const eggZero = childrenList.filter(c => c.eggIntake === 0).length;
  const eggLow = childrenList.filter(c => c.eggIntake >= 1 && c.eggIntake <= 2).length;
  const eggModerate = childrenList.filter(c => c.eggIntake >= 3 && c.eggIntake <= 4).length;
  const eggGood = childrenList.filter(c => c.eggIntake >= 5 && c.eggIntake <= 6).length;
  const eggDaily = childrenList.filter(c => c.eggIntake >= 7).length;
  const eggOptimal = eggGood + eggDaily;

  const maxEggBucket = Math.max(eggZero, eggLow, eggModerate, eggGood, eggDaily, 1);

  const totalEggs = childrenList.reduce((sum, c) => sum + c.eggIntake, 0);
  const avgEggs = (totalEggs / total).toFixed(1);

  // 2. Milk distribution
  const milk12 = childrenList.filter(c => c.milkIntake === '1-2 times').length;
  const milk34 = childrenList.filter(c => c.milkIntake === '3-4 times').length;
  const milk56 = childrenList.filter(c => c.milkIntake === '5-6 times').length;
  const milk7plus = childrenList.filter(c => c.milkIntake === '7 or more times').length;
  const milkOptimalPct = Math.round(((milk56 + milk7plus) / total) * 100);

  // 3. Vegetable distribution
  const vegRarely = childrenList.filter(c => c.vegetableIntake === 'rarely').length;
  const veg12 = childrenList.filter(c => c.vegetableIntake === '1-2 times a week').length;
  const veg34 = childrenList.filter(c => c.vegetableIntake === '3-4 times a week').length;

  // 4. Deficit counters
  const eggDeficitCount = childrenList.filter(c => c.eggIntake < 3).length;
  const milkDeficitCount = childrenList.filter(c => c.milkIntake === '1-2 times' || c.milkIntake === '3-4 times').length;
  const vegDeficitCount = childrenList.filter(c => c.vegetableIntake === 'rarely' || c.vegetableIntake === '1-2 times a week').length;
  const bmiDeficitCount = childrenList.filter(c => {
    const a = analyzeChild(c);
    return a.bmi < 14;
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-[#E0E7DB] shadow-sm p-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E0E7DB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#4A7C44] bg-[#F0F4EF] px-2.5 py-0.5 rounded border border-[#CBD5C0]">
              <Sparkles className="h-3 w-3" /> Village Dietary Analysis
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#1B2A18] mt-1">
            Weekly Egg, Milk & Vegetable Intake
          </h2>
          <p className="text-xs sm:text-sm text-[#7A8676]">
            Evaluating rural school nutrition against National Anganwadi Standards (ICMR-NIN Guidelines)
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-[#F0F4EF] rounded-xl text-xs font-semibold text-[#7A8676] border border-[#E0E7DB] self-start sm:self-auto">
          <button
            id="tab-nutrition-pillars"
            onClick={() => setActiveTab('pillars')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'pillars'
                ? 'bg-white text-[#1B2A18] shadow-xs font-bold'
                : 'hover:text-[#1B2A18]'
            }`}
          >
            3 Nutritional Pillars
          </button>
          <button
            id="tab-nutrition-deficits"
            onClick={() => setActiveTab('deficits')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'deficits'
                ? 'bg-white text-[#1B2A18] shadow-xs font-bold'
                : 'hover:text-[#1B2A18]'
            }`}
          >
            Deficit Breakdown
          </button>
          <button
            id="tab-nutrition-who"
            onClick={() => setActiveTab('who_comparison')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'who_comparison'
                ? 'bg-white text-[#1B2A18] shadow-xs font-bold'
                : 'hover:text-[#1B2A18]'
            }`}
          >
            BMI & Growth Curve
          </button>
        </div>
      </div>

      {/* TAB 1: 3 Nutritional Pillars (Eggs, Milk, Vegetables) */}
      {activeTab === 'pillars' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Egg Intake with Geometric Pillars */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A8676]">Egg Distribution</span>
                <span className="text-xs font-bold text-[#A88B45]">AVG: {avgEggs}/WK</span>
              </div>

              {/* Geometric Vertical Bar Chart */}
              <div className="h-44 flex items-end justify-between gap-3 pt-6 px-1">
                <div className="w-full flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#7A8676]">{eggZero}</span>
                  <div
                    className="w-full bg-[#F3E5AB] rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(12, Math.round((eggZero / maxEggBucket) * 110))}px` }}
                    title={`${eggZero} children with 0 eggs`}
                  />
                </div>
                <div className="w-full flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#7A8676]">{eggLow}</span>
                  <div
                    className="w-full bg-[#F3E5AB] rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(12, Math.round((eggLow / maxEggBucket) * 110))}px` }}
                    title={`${eggLow} children with 1-2 eggs`}
                  />
                </div>
                <div className="w-full flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#A88B45]">{eggModerate}</span>
                  <div
                    className="w-full bg-[#FFD700] rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(12, Math.round((eggModerate / maxEggBucket) * 110))}px` }}
                    title={`${eggModerate} children with 3-4 eggs`}
                  />
                </div>
                <div className="w-full flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#A88B45]">{eggGood}</span>
                  <div
                    className="w-full bg-[#FFD700] rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(12, Math.round((eggGood / maxEggBucket) * 110))}px` }}
                    title={`${eggGood} children with 5-6 eggs`}
                  />
                </div>
                <div className="w-full flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#4A7C44]">{eggDaily}</span>
                  <div
                    className="w-full bg-[#4A7C44] rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(12, Math.round((eggDaily / maxEggBucket) * 110))}px` }}
                    title={`${eggDaily} children with 7+ eggs`}
                  />
                </div>
              </div>

              {/* Bottom labels */}
              <div className="flex justify-between text-[10px] text-[#7A8676] font-bold mt-3 border-t border-[#E0E7DB] pt-2">
                <span>0 EGGS</span>
                <span>1-2</span>
                <span>3-4</span>
                <span>5-6</span>
                <span>7+</span>
              </div>
            </div>

            {/* Target reminder */}
            <div className="mt-4 text-xs bg-[#FFF9E6] text-[#A88B45] p-3 rounded-xl border border-[#F3E5AB] flex items-center justify-between">
              <span>Standard: <strong className="font-semibold">≥ 4 eggs/week</strong></span>
              <span className="font-bold">
                {Math.round(((eggModerate + eggOptimal) / total) * 100)}% Reach Target
              </span>
            </div>
          </div>

          {/* Card 2: Milk Consumption with Geometric Ring Gauge */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A8676]">Milk Intake Frequency</span>
                <span className="text-xs font-bold text-[#3B82F6]">GOAL: 7/WK</span>
              </div>

              {/* Geometric Circular Ring */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-32 h-32 rounded-full border-8 border-[#E6F4FF] flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-black text-[#1B2A18]">{milkOptimalPct}%</span>
                    <span className="block text-[9px] font-bold text-[#7A8676] uppercase tracking-wider">
                      Daily Reach
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#7A8676] border-t border-[#E0E7DB] pt-3">
                <span>Daily (7+): <strong className="text-[#1B2A18]">{Math.round((milk7plus / total) * 100)}%</strong></span>
                <span>Regular (5-6x): <strong className="text-[#1B2A18]">{Math.round((milk56 / total) * 100)}%</strong></span>
                <span>Low: <strong className="text-[#1B2A18]">{Math.round(((milk12 + milk34) / total) * 100)}%</strong></span>
              </div>

              <div className="mt-4 text-xs bg-[#E6F4FF] text-[#1E40AF] p-3 rounded-xl border border-[#BDE0FF] flex items-center justify-between">
                <span>Standard: <strong className="font-semibold">≥ 5-7 times/week</strong></span>
                <span className="font-bold">{milkOptimalPct}% Target</span>
              </div>
            </div>
          </div>

          {/* Card 3: Vegetable Compliance with Geometric Progress Tracks */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A8676]">Vegetable Compliance</span>
                <span className="text-xs font-bold text-[#10B981]">TARGET: 100%</span>
              </div>

              <div className="space-y-4 my-6">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#1B2A18]">Daily Leafy Greens (3-4x)</span>
                    <span className="text-[#4A7C44] font-bold">{Math.round((veg34 / total) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-[#E6F4E6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: `${(veg34 / total) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#1B2A18]">Seasonal / Occasional (1-2x)</span>
                    <span className="text-[#A88B45] font-bold">{Math.round((veg12 / total) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-[#FFF9E6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#A88B45] rounded-full transition-all duration-500" style={{ width: `${(veg12 / total) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#1B2A18]">Severe Micronutrient Deficit (Rarely)</span>
                    <span className="text-[#DC2626] font-bold">{Math.round((vegRarely / total) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-[#FEE2E2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#DC2626] rounded-full transition-all duration-500" style={{ width: `${(vegRarely / total) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E0E7DB] pt-3 flex items-center justify-between text-[11px] text-[#7A8676]">
              <span>Village Poshan Vatika</span>
              <span className="text-[#1B2A18] font-bold">{Math.round((veg34 / total) * 100)}% Optimal Yield</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Deficit Breakdown */}
      {activeTab === 'deficits' && (
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E0E7DB] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A88B45]">Egg Deficit</span>
                <Egg className="h-4 w-4 text-[#A88B45]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1B2A18]">
                {eggDeficitCount} / {total}
              </div>
              <p className="text-xs text-[#7A8676] mt-1">
                {Math.round((eggDeficitCount / total) * 100)}% eat &lt; 3 eggs/wk
              </p>
              <div className="mt-2 text-[11px] text-[#A88B45] bg-[#FFF9E6] border border-[#F3E5AB] p-2 rounded-lg font-medium">
                Protein & bioavailable choline deficit
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E0E7DB] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">Milk Deficit</span>
                <Milk className="h-4 w-4 text-[#3B82F6]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1B2A18]">
                {milkDeficitCount} / {total}
              </div>
              <p className="text-xs text-[#7A8676] mt-1">
                {Math.round((milkDeficitCount / total) * 100)}% drink &lt; 5x/wk
              </p>
              <div className="mt-2 text-[11px] text-[#1E40AF] bg-[#E6F4FF] border border-[#BDE0FF] p-2 rounded-lg font-medium">
                Calcium & skeletal bone growth risk
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E0E7DB] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A7C44]">Vegetable Deficit</span>
                <Salad className="h-4 w-4 text-[#4A7C44]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1B2A18]">
                {vegDeficitCount} / {total}
              </div>
              <p className="text-xs text-[#7A8676] mt-1">
                {Math.round((vegDeficitCount / total) * 100)}% eat &le; 2x/wk
              </p>
              <div className="mt-2 text-[11px] text-[#065F46] bg-[#E6F4E6] border border-[#C6E0C6] p-2 rounded-lg font-medium">
                Anemia & micronutrient deficiency
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E0E7DB] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">Acute Low BMI (&lt;14)</span>
                <Activity className="h-4 w-4 text-[#DC2626]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1B2A18]">
                {bmiDeficitCount} / {total}
              </div>
              <p className="text-xs text-[#7A8676] mt-1">
                {Math.round((bmiDeficitCount / total) * 100)}% acute wasting rate
              </p>
              <div className="mt-2 text-[11px] text-[#DC2626] bg-[#FEE2E2] border border-[#FECACA] p-2 rounded-lg font-medium">
                Urgent clinical health check recommended
              </div>
            </div>
          </div>

          {/* Action Recommendations Box */}
          <div className="mt-5 p-4 rounded-xl bg-[#F0F4EF] border border-[#CBD5C0] flex items-start gap-3">
            <Info className="h-5 w-5 text-[#4A7C44] shrink-0 mt-0.5" />
            <div className="text-xs text-[#2D3628] leading-relaxed">
              <p className="font-bold text-[#1B2A18] text-sm">
                Community Health Worker (ASHA / Anganwadi) Guidance:
              </p>
              <p className="mt-1 text-[#7A8676]">
                Prioritize mid-day meal supplementary egg distribution on Mondays, Wednesdays, and Fridays. For children in Ward 3 and Ward 4 showing both egg and vegetable deficits, coordinate with the Gram Panchayat to supply iron-fortified milk powder and village Poshan Vatika greens.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BMI & Growth Curve Overview */}
      {activeTab === 'who_comparison' && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E0E7DB] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">WHO: Severely Underweight</span>
              <div className="text-2xl font-bold text-[#1B2A18] mt-1">
                {childrenList.filter(c => analyzeChild(c).bmiCategory === 'Severely Underweight').length} Children
              </div>
              <p className="text-[11px] text-[#7A8676] mt-1">BMI &lt; 13.0 (Immediate referral)</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E0E7DB] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88B45]">WHO: Underweight / Deficit</span>
              <div className="text-2xl font-bold text-[#1B2A18] mt-1">
                {childrenList.filter(c => analyzeChild(c).bmiCategory === 'Underweight').length} Children
              </div>
              <p className="text-[11px] text-[#7A8676] mt-1">BMI 13.0 - 14.5 (Targeted supplement)</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E0E7DB] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A7C44]">WHO: Normal Growth</span>
              <div className="text-2xl font-bold text-[#1B2A18] mt-1">
                {childrenList.filter(c => analyzeChild(c).bmiCategory === 'Normal').length} Children
              </div>
              <p className="text-[11px] text-[#7A8676] mt-1">BMI 14.5 - 18.5 (Optimal trajectory)</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#1B2A18] text-white border border-[#2D3628]">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#4A7C44]" />
              Weight vs Height Growth Dispersion
            </h4>
            <p className="text-xs text-[#CBD5C0] mt-1">
              Sample children plotted across Anganwadi age range (3 to 10 years).
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {childrenList.map((child) => {
                const a = analyzeChild(child);
                return (
                  <span
                    key={child.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      a.status === 'Good Nutrition'
                        ? 'bg-[#1B2A18] border-[#4A7C44] text-[#C6E0C6]'
                        : a.status === 'Needs Improvement'
                        ? 'bg-[#1B2A18] border-[#A88B45] text-[#F3E5AB]'
                        : 'bg-[#1B2A18] border-[#DC2626] text-[#FECACA]'
                    }`}
                  >
                    <span>{child.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-[#7A8676]">({child.age}y)</span>
                    <span className="font-mono text-[10px] font-bold">BMI {a.bmi}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
