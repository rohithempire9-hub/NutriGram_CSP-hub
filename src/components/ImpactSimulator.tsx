import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Egg, Milk, Salad, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { ChildRecord, MilkIntake, VegetableIntake } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';

interface ImpactSimulatorProps {
  childrenList: ChildRecord[];
  onClose: () => void;
}

export const ImpactSimulator: React.FC<ImpactSimulatorProps> = ({ childrenList, onClose }) => {
  const [bonusEggs, setBonusEggs] = useState<number>(2);
  const [boostMilk, setBoostMilk] = useState<boolean>(true);
  const [boostVeggies, setBoostVeggies] = useState<boolean>(true);

  // Calculate current baseline
  const currentAtRisk = childrenList.filter(c => analyzeChild(c).status === 'At Risk').length;
  const currentGood = childrenList.filter(c => analyzeChild(c).status === 'Good Nutrition').length;
  const currentImprovement = childrenList.filter(c => analyzeChild(c).status === 'Needs Improvement').length;

  // Calculate simulated scenario
  const simulatedChildren = childrenList.map(c => {
    let simulatedEggs = c.eggIntake + bonusEggs;
    let simulatedMilk: MilkIntake = c.milkIntake;
    let simulatedVeggies: VegetableIntake = c.vegetableIntake;

    if (boostMilk) {
      if (c.milkIntake === '1-2 times' || c.milkIntake === '3-4 times') {
        simulatedMilk = '5-6 times';
      }
    }

    if (boostVeggies) {
      simulatedVeggies = '3-4 times a week';
    }

    return {
      ...c,
      eggIntake: simulatedEggs,
      milkIntake: simulatedMilk,
      vegetableIntake: simulatedVeggies,
    };
  });

  const simulatedAtRisk = simulatedChildren.filter(c => analyzeChild(c).status === 'At Risk').length;
  const simulatedGood = simulatedChildren.filter(c => analyzeChild(c).status === 'Good Nutrition').length;
  const simulatedImprovement = simulatedChildren.filter(c => analyzeChild(c).status === 'Needs Improvement').length;

  const rescuedKids = currentAtRisk - simulatedAtRisk;
  const newGoodKids = simulatedGood - currentGood;

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Approximate cost per child per week (e.g. ₹6 per egg, ₹10 per milk glass)
  const estimatedCostPerChild = bonusEggs * 6 + (boostMilk ? 35 : 0) + (boostVeggies ? 15 : 0);
  const totalWeeklyBudget = estimatedCostPerChild * childrenList.length;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-[#1B2A18] text-white rounded-2xl p-6 sm:p-8 border border-[#2D3628] shadow-md mb-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D3628] pb-5">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#F3E5AB] bg-[#2D3628] px-2.5 py-1 rounded border border-[#4A7C44]/40">
            <Sparkles className="h-3 w-3 text-[#A88B45]" /> Community Service Proposal Simulator
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
            Village Nutrition Intervention Drive
          </h2>
          <p className="text-xs sm:text-sm text-[#CBD5C0] max-w-2xl mt-1">
            Simulate the health outcome shift if our community service project sponsors additional weekly eggs, fortified milk, and Poshan Vatika greens in the village school.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setBonusEggs(0);
              setBoostMilk(false);
              setBoostVeggies(false);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2D3628] hover:bg-[#394533] text-[#CBD5C0] flex items-center gap-1.5 border border-[#4A7C44]/40 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2D3628] hover:bg-[#394533] text-[#CBD5C0] border border-[#4A7C44]/40 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Control sliders & toggles */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intervention 1: Egg Drive */}
        <div className="bg-[#233320] rounded-xl p-5 border border-[#2D3628]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F3E5AB] flex items-center gap-1.5">
              <Egg className="h-4 w-4 text-[#A88B45]" /> Add Eggs to Mid-Day Meal
            </span>
            <span className="text-xs font-mono font-bold bg-[#A88B45] text-white px-2 py-0.5 rounded">
              +{bonusEggs} Eggs / wk
            </span>
          </div>
          <p className="text-[11px] text-[#CBD5C0] mt-1">
            Adds essential animal protein, iron, and bioavailable choline.
          </p>

          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={bonusEggs}
            onChange={(e) => setBonusEggs(Number(e.target.value))}
            className="w-full mt-4 accent-[#A88B45] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-[#7A8676] font-mono mt-1 font-bold">
            <span>+0</span>
            <span>+1</span>
            <span>+2</span>
            <span>+3</span>
            <span>+4</span>
            <span>+5 (Daily)</span>
          </div>
        </div>

        {/* Intervention 2: Milk Fortification */}
        <div className="bg-[#233320] rounded-xl p-5 border border-[#2D3628]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#BDE0FF] flex items-center gap-1.5">
              <Milk className="h-4 w-4 text-[#3B82F6]" /> Morning Milk Assembly
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              boostMilk ? 'bg-[#3B82F6] text-white' : 'bg-[#2D3628] text-[#7A8676]'
            }`}>
              {boostMilk ? 'Enabled (5-6x)' : 'Disabled'}
            </span>
          </div>
          <p className="text-[11px] text-[#CBD5C0] mt-1">
            Ensures all under-nourished children receive 200ml milk on school days.
          </p>

          <button
            onClick={() => setBoostMilk(!boostMilk)}
            className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all ${
              boostMilk
                ? 'bg-[#3B82F6] text-white shadow-xs'
                : 'bg-[#2D3628] text-[#CBD5C0] hover:bg-[#394533]'
            }`}
          >
            {boostMilk ? '✓ Active in Simulation' : '+ Activate Milk Boost'}
          </button>
        </div>

        {/* Intervention 3: Green Vegetable Garden */}
        <div className="bg-[#233320] rounded-xl p-5 border border-[#2D3628]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#C6E0C6] flex items-center gap-1.5">
              <Salad className="h-4 w-4 text-[#4A7C44]" /> School Poshan Vatika
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              boostVeggies ? 'bg-[#4A7C44] text-white' : 'bg-[#2D3628] text-[#7A8676]'
            }`}>
              {boostVeggies ? 'Active (3-4x)' : 'Disabled'}
            </span>
          </div>
          <p className="text-[11px] text-[#CBD5C0] mt-1">
            Community garden supplying fresh drumstick leaves, spinach, and squash.
          </p>

          <button
            onClick={() => setBoostVeggies(!boostVeggies)}
            className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all ${
              boostVeggies
                ? 'bg-[#4A7C44] text-white shadow-xs'
                : 'bg-[#2D3628] text-[#CBD5C0] hover:bg-[#394533]'
            }`}
          >
            {boostVeggies ? '✓ Active in Simulation' : '+ Activate Garden Boost'}
          </button>
        </div>
      </div>

      {/* Projected Outcome Summary */}
      <div className="mt-6 pt-6 border-t border-[#2D3628] grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* At Risk Reduction */}
        <div className="bg-[#142012] rounded-xl p-5 border border-[#2D3628] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#7A8676] uppercase tracking-wider font-bold">
              At-Risk Children
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-[#FECACA] line-through opacity-70">
                {currentAtRisk}
              </span>
              <ArrowRight className="h-4 w-4 text-[#7A8676] inline" />
              <span className="text-3xl font-black text-[#4A7C44]">
                {simulatedAtRisk}
              </span>
            </div>
            <p className="text-[11px] text-[#C6E0C6] font-semibold mt-1">
              {rescuedKids > 0 ? `-${rescuedKids} children rescued from danger` : 'No change'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#4A7C44]/20 text-[#4A7C44] flex items-center justify-center font-bold">
            {rescuedKids > 0 ? `-${rescuedKids}` : '0'}
          </div>
        </div>

        {/* Good Nutrition Expansion */}
        <div className="bg-[#142012] rounded-xl p-5 border border-[#2D3628] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#7A8676] uppercase tracking-wider font-bold">
              Good Nutrition (Healthy)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-[#CBD5C0] opacity-70">
                {currentGood}
              </span>
              <ArrowRight className="h-4 w-4 text-[#7A8676] inline" />
              <span className="text-3xl font-black text-[#4A7C44]">
                {simulatedGood}
              </span>
            </div>
            <p className="text-[11px] text-[#C6E0C6] font-semibold mt-1">
              {newGoodKids > 0 ? `+${newGoodKids} children elevated to healthy` : 'No increase'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#4A7C44]/20 text-[#4A7C44] flex items-center justify-center font-bold">
            {newGoodKids > 0 ? `+${newGoodKids}` : '0'}
          </div>
        </div>

        {/* Estimated Budget & Presentation Action */}
        <div className="bg-[#142012] rounded-xl p-5 border border-[#2D3628] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#7A8676] uppercase tracking-wider font-bold">
                Community Sponsorship
              </span>
              <span className="text-[10px] bg-[#A88B45]/20 text-[#F3E5AB] px-2 py-0.5 rounded font-mono font-bold">
                Est. ~₹{estimatedCostPerChild}/child/wk
              </span>
            </div>
            <div className="text-xl font-bold text-white mt-1">
              ₹{totalWeeklyBudget} / week for school
            </div>
          </div>

          <button
            onClick={handleCelebrate}
            className="mt-3 w-full py-2.5 bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors active:scale-98"
          >
            <CheckCircle2 className="h-4 w-4 text-white" />
            Celebrate Goal Impact
          </button>
        </div>
      </div>
    </motion.div>
  );
};
