import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Egg,
  Milk,
  Salad,
  Users,
  ShieldAlert,
  Heart,
  Award,
  TrendingUp,
  School,
} from 'lucide-react';
import { ChildRecord, VillageStats } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';

interface PresentationModeProps {
  childrenList: ChildRecord[];
  stats: VillageStats;
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  childrenList,
  stats,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const total = childrenList.length || 1;
  const goodPct = Math.round((stats.goodCount / total) * 100);
  const impPct = Math.round((stats.improvementCount / total) * 100);
  const riskPct = Math.round((stats.atRiskCount / total) * 100);

  const eggDeficitCount = childrenList.filter((c) => c.eggIntake < 3).length;
  const milkDeficitCount = childrenList.filter(
    (c) => c.milkIntake === '1-2 times' || c.milkIntake === '3-4 times'
  ).length;
  const vegDeficitCount = childrenList.filter(
    (c) => c.vegetableIntake === 'rarely' || c.vegetableIntake === '1-2 times a week'
  ).length;

  const slides = [
    // Slide 1: Title & Overview
    {
      title: 'NutriGram: Village Child Nutrition Initiative',
      subtitle: 'Community Service Health Assessment in Rural Anganwadi & Primary Schools',
      type: 'hero',
    },
    // Slide 2: The Core Cohort Metrics
    {
      title: 'Current Baseline: The Nutritional Reality',
      subtitle: 'Comprehensive survey of enrolled children across village wards',
      type: 'metrics',
    },
    // Slide 3: The 3 Nutritional Pillars (Eggs, Milk, Vegetables)
    {
      title: 'The 3 Pillars of Child Diet: Eggs, Milk & Greens',
      subtitle: 'Weekly intake frequency versus ICMR-NIN Anganwadi standards',
      type: 'pillars',
    },
    // Slide 4: Children Needing Urgent Care & BMI
    {
      title: 'Critical Health Alerts: Wasting & Acute Deficit',
      subtitle: 'Identification of high-risk children requiring immediate supplementary care',
      type: 'at_risk',
    },
    // Slide 5: Action Plan & Community Recommendation
    {
      title: 'Action Plan: Sustainable Village Nutrition Drive',
      subtitle: 'Proposed Mid-Day Meal Egg & Milk Sponsorship with Poshan Vatika',
      type: 'action_plan',
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#142012] text-[#F4F7F2] flex flex-col justify-between overflow-hidden">
      {/* Presentation Top Control Bar */}
      <div className="px-6 py-4 border-b border-[#2D3628] flex items-center justify-between bg-[#1B2A18]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#4A7C44] text-white flex items-center justify-center font-bold">
            <School className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88B45]">
              NutriGram Presentation Deck
            </span>
            <p className="text-xs text-[#CBD5C0]">
              Slide {currentSlide + 1} of {slides.length}: {slides[currentSlide].title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Slide Indicator Dots */}
          <div className="hidden sm:flex items-center gap-1.5 mr-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-[#4A7C44]' : 'w-2 bg-[#2D3628] hover:bg-[#394533]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-[#CBD5C0] hover:text-white bg-[#2D3628] hover:bg-[#394533] rounded-xl border border-[#4A7C44]/40 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-[#CBD5C0] hover:text-white bg-[#2D3628] hover:bg-[#394533] rounded-xl border border-[#4A7C44]/40 transition-colors"
            title="Exit Presentation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Slide Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* SLIDE 1: HERO TITLE */}
              {slides[currentSlide].type === 'hero' && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D3628] border border-[#4A7C44]/40 text-[#F3E5AB] text-[10px] font-bold uppercase tracking-wider mb-6">
                    <Sparkles className="h-3.5 w-3.5 text-[#A88B45]" /> Community Service Health Project
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                    Nourishing Our Future: <br />
                    <span className="text-[#C6E0C6]">
                      Village Child Nutrition Monitor
                    </span>
                  </h1>
                  <p className="text-[#CBD5C0] text-base sm:text-xl max-w-3xl mx-auto mt-6 leading-relaxed">
                    A grassroots assessment of weekly egg, milk, and vegetable consumption among schoolchildren and Anganwadi attendees to eradicate hidden hunger in rural communities.
                  </p>

                  <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <div className="p-5 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="text-2xl font-bold text-white font-mono">{stats.totalChildren}</div>
                      <div className="text-xs text-[#CBD5C0] mt-1 font-semibold">Children Monitored</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="text-2xl font-bold text-[#F3E5AB] font-mono">{stats.avgEggs} / wk</div>
                      <div className="text-xs text-[#CBD5C0] mt-1 font-semibold">Avg Weekly Eggs</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="text-2xl font-bold text-[#BDE0FF] font-mono">{stats.milkOptimalPercent}%</div>
                      <div className="text-xs text-[#CBD5C0] mt-1 font-semibold">Daily Milk Intake</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="text-2xl font-bold text-[#A3E635] font-mono">{stats.avgBmi}</div>
                      <div className="text-xs text-[#CBD5C0] mt-1 font-semibold">Cohort Mean BMI</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: CURRENT COHORT STATUS */}
              {slides[currentSlide].type === 'metrics' && (
                <div>
                  <div className="mb-8">
                    <span className="text-[10px] font-bold text-[#A88B45] uppercase tracking-wider">
                      Executive Summary
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-sm text-[#CBD5C0] mt-1">{slides[currentSlide].subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-[#233320] border border-[#4A7C44]/40">
                      <div className="flex items-center justify-between">
                        <Heart className="h-6 w-6 text-[#4A7C44]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4A7C44]/20 text-[#A3E635] border border-[#4A7C44]/40">
                          {goodPct}% of Cohort
                        </span>
                      </div>
                      <div className="text-4xl font-extrabold text-white mt-4">
                        {stats.goodCount} Children
                      </div>
                      <h4 className="text-sm font-bold text-[#C6E0C6] mt-1">Good Nutrition Status</h4>
                      <p className="text-xs text-[#CBD5C0] mt-2 leading-relaxed">
                        Regular egg intake (&ge;3/wk), regular milk (&ge;5x/wk), and green vegetables with BMI within healthy WHO limits.
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-[#233320] border border-[#A88B45]/40">
                      <div className="flex items-center justify-between">
                        <TrendingUp className="h-6 w-6 text-[#A88B45]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#A88B45]/20 text-[#F3E5AB] border border-[#A88B45]/40">
                          {impPct}% of Cohort
                        </span>
                      </div>
                      <div className="text-4xl font-extrabold text-white mt-4">
                        {stats.improvementCount} Children
                      </div>
                      <h4 className="text-sm font-bold text-[#F3E5AB] mt-1">Needs Improvement</h4>
                      <p className="text-xs text-[#CBD5C0] mt-2 leading-relaxed">
                        Exhibits 1-2 deficit factors—most frequently low milk access or erratic vegetable intake due to seasonal scarcity.
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-[#233320] border border-[#DC2626]/40">
                      <div className="flex items-center justify-between">
                        <ShieldAlert className="h-6 w-6 text-[#DC2626]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DC2626]/20 text-[#FECACA] border border-[#DC2626]/40">
                          {riskPct}% of Cohort
                        </span>
                      </div>
                      <div className="text-4xl font-extrabold text-white mt-4">
                        {stats.atRiskCount} Children
                      </div>
                      <h4 className="text-sm font-bold text-[#FECACA] mt-1">High Nutritional Risk</h4>
                      <p className="text-xs text-[#CBD5C0] mt-2 leading-relaxed">
                        Acute vulnerability: Severe protein deficit (&lt;2 eggs/wk), rare vegetables, and low BMI (&lt;14).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 3: 3 PILLARS */}
              {slides[currentSlide].type === 'pillars' && (
                <div>
                  <div className="mb-8">
                    <span className="text-[10px] font-bold text-[#A88B45] uppercase tracking-wider">
                      Dietary Distribution
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-sm text-[#CBD5C0] mt-1">{slides[currentSlide].subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Eggs */}
                    <div className="p-6 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="h-10 w-10 rounded-xl bg-[#A88B45] text-white flex items-center justify-center font-bold">
                        <Egg className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mt-3">Weekly Eggs Consumed</h3>
                      <div className="text-2xl font-bold text-[#F3E5AB] mt-1 font-mono">
                        {stats.avgEggs} / week avg
                      </div>
                      <p className="text-xs text-[#CBD5C0] mt-2">
                        {eggDeficitCount} out of {total} children eat fewer than 3 eggs a week, causing a major deficit in bioavailable protein and essential choline.
                      </p>
                      <div className="mt-4 p-3 rounded-xl bg-[#1B2A18] border border-[#2D3628] text-xs text-[#F3E5AB] font-medium">
                        Target: Minimum 4 eggs/week via Mid-Day Meal
                      </div>
                    </div>

                    {/* Milk */}
                    <div className="p-6 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="h-10 w-10 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center font-bold">
                        <Milk className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mt-3">Milk Intake Frequency</h3>
                      <div className="text-2xl font-bold text-[#BDE0FF] mt-1 font-mono">
                        {stats.milkOptimalPercent}% Daily
                      </div>
                      <p className="text-xs text-[#CBD5C0] mt-2">
                        {milkDeficitCount} children have sub-optimal milk access (&le;4 times/wk), restricting essential dietary calcium and Vitamin D for bone density.
                      </p>
                      <div className="mt-4 p-3 rounded-xl bg-[#1B2A18] border border-[#2D3628] text-xs text-[#BDE0FF] font-medium">
                        Target: 200ml fortified warm milk daily
                      </div>
                    </div>

                    {/* Vegetables */}
                    <div className="p-6 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="h-10 w-10 rounded-xl bg-[#4A7C44] text-white flex items-center justify-center font-bold">
                        <Salad className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mt-3">Green Vegetables</h3>
                      <div className="text-2xl font-bold text-[#A3E635] mt-1 font-mono">
                        {stats.vegetableOptimalPercent}% Regular
                      </div>
                      <p className="text-xs text-[#CBD5C0] mt-2">
                        {vegDeficitCount} children eat green vegetables 2 or fewer times a week, driving chronic iron deficiency anemia and Vitamin A deficits.
                      </p>
                      <div className="mt-4 p-3 rounded-xl bg-[#1B2A18] border border-[#2D3628] text-xs text-[#C6E0C6] font-medium">
                        Target: School Poshan Vatika nutrition garden
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 4: AT RISK CHILDREN ROSTER */}
              {slides[currentSlide].type === 'at_risk' && (
                <div>
                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
                      Priority Interventions
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-sm text-[#CBD5C0] mt-1">{slides[currentSlide].subtitle}</p>
                  </div>

                  <div className="bg-[#233320] rounded-xl border border-[#2D3628] p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#2D3628] text-[#7A8676] font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3">Child Name</th>
                            <th className="py-2.5 px-3">Age / Gender</th>
                            <th className="py-2.5 px-3">Ward</th>
                            <th className="py-2.5 px-3 text-center">BMI</th>
                            <th className="py-2.5 px-3 text-center">Eggs/Wk</th>
                            <th className="py-2.5 px-3">Milk</th>
                            <th className="py-2.5 px-3">Vegetables</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D3628] text-[#CBD5C0]">
                          {childrenList
                            .filter((c) => analyzeChild(c).status === 'At Risk')
                            .map((child) => {
                              const a = analyzeChild(child);
                              return (
                                <tr key={child.id} className="hover:bg-[#1B2A18]/50 transition-colors">
                                  <td className="py-2.5 px-3 font-bold text-white">{child.name}</td>
                                  <td className="py-2.5 px-3">
                                    {child.age} yrs • <span className="capitalize">{child.gender}</span>
                                  </td>
                                  <td className="py-2.5 px-3 text-[#7A8676]">{child.ward || 'Basti'}</td>
                                  <td className="py-2.5 px-3 text-center font-mono font-bold text-[#DC2626]">
                                    {a.bmi}
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-bold text-[#A88B45]">
                                    {child.eggIntake}
                                  </td>
                                  <td className="py-2.5 px-3 text-[#3B82F6]">{child.milkIntake}</td>
                                  <td className="py-2.5 px-3 text-[#DC2626]">{child.vegetableIntake}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 5: ACTION PLAN */}
              {slides[currentSlide].type === 'action_plan' && (
                <div>
                  <div className="mb-8">
                    <span className="text-[10px] font-bold text-[#A88B45] uppercase tracking-wider">
                      Proposed Community Service Roadmap
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-sm text-[#CBD5C0] mt-1">{slides[currentSlide].subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="h-10 w-10 rounded-xl bg-[#4A7C44]/20 text-[#A3E635] flex items-center justify-center font-bold mb-4">
                        1
                      </div>
                      <h3 className="text-base font-bold text-white">Tri-Weekly Egg Distribution</h3>
                      <p className="text-xs text-[#CBD5C0] mt-2 leading-relaxed">
                        Add 2-3 hard-boiled eggs per week to the government Mid-Day Meal scheme. Cost: ~₹18 per child per week. Reduces protein malnutrition by 85%.
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/20 text-[#BDE0FF] flex items-center justify-center font-bold mb-4">
                        2
                      </div>
                      <h3 className="text-base font-bold text-white">Gram Panchayat Milk Fund</h3>
                      <p className="text-xs text-[#CBD5C0] mt-2 leading-relaxed">
                        Partner with local dairy cooperatives to supply 200ml milk on school mornings, targeting calcium mineralization and skeletal height boost.
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-[#233320] border border-[#2D3628]">
                      <div className="h-10 w-10 rounded-xl bg-[#A88B45]/20 text-[#F3E5AB] flex items-center justify-center font-bold mb-4">
                        3
                      </div>
                      <h3 className="text-base font-bold text-white">School Poshan Vatika Gardens</h3>
                      <p className="text-xs text-[#CBD5C0] mt-2 leading-relaxed">
                        Students and teachers cultivate drumstick (moringa), spinach, tomatoes, and pumpkins on school grounds to guarantee year-round micronutrients.
                      </p>
                    </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="mt-8 p-5 rounded-xl bg-[#142012] border border-[#2D3628] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Presented by NutriGram Community Service Team
                      </h4>
                      <p className="text-xs text-[#C6E0C6]">
                        Empowering Rural Village Schools Through Data-Driven Nutrition Monitoring
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs shadow-xs transition-colors active:scale-98"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Presentation Bottom Navigation Bar */}
      <div className="px-6 py-4 border-t border-[#2D3628] flex items-center justify-between bg-[#1B2A18]">
        <div className="text-xs text-[#7A8676]">
          Use <span className="font-mono bg-[#2D3628] px-1.5 py-0.5 rounded text-white">&larr;</span> /{' '}
          <span className="font-mono bg-[#2D3628] px-1.5 py-0.5 rounded text-white">&rarr;</span> or spacebar to advance
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2D3628] hover:bg-[#394533] disabled:opacity-30 disabled:cursor-not-allowed text-[#CBD5C0] flex items-center gap-1 border border-[#4A7C44]/40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button
            disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4A7C44] hover:bg-[#3e6839] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1 transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
