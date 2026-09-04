import React, { useState, useMemo } from 'react';
import { ChildRecord, FoodSuggestionItem } from '../types';
import { NUTRITION_FOOD_ITEMS } from '../data/foodSuggestionsData';
import { analyzeChild } from '../utils/nutritionCalculations';
import {
  Utensils,
  User,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Egg,
  Milk,
  Salad,
  Flame,
  Printer,
  ChevronRight,
  Filter,
  Heart,
  Info,
} from 'lucide-react';

interface FoodSuggestionsPageProps {
  childrenList: ChildRecord[];
  selectedChildId?: string;
  onSelectChild: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const FoodSuggestionsPage: React.FC<FoodSuggestionsPageProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  onNavigate,
}) => {
  // Currently active child
  const [activeChildId, setActiveChildId] = useState<string>(
    selectedChildId || (childrenList[0]?.id ?? '')
  );

  const [categoryFilter, setCategoryFilter] = useState<string>('tailored');

  const activeChild = useMemo(
    () => childrenList.find((c) => c.id === activeChildId) || childrenList[0],
    [childrenList, activeChildId]
  );

  const childAnalysis = useMemo(() => {
    if (!activeChild) return null;
    return analyzeChild(activeChild);
  }, [activeChild]);

  // Determine which food items to prioritize based on child deficits
  const filteredFoods = useMemo(() => {
    if (!childAnalysis) return NUTRITION_FOOD_ITEMS;

    if (categoryFilter === 'all') {
      return NUTRITION_FOOD_ITEMS;
    }

    if (categoryFilter === 'tailored') {
      // Prioritize foods matching child's deficits
      return NUTRITION_FOOD_ITEMS.filter((item) => {
        if (childAnalysis.eggDeficit && item.targetDeficit === 'egg') return true;
        if (childAnalysis.milkDeficit && item.targetDeficit === 'milk') return true;
        if (childAnalysis.vegetableDeficit && item.targetDeficit === 'vegetable') return true;
        if (childAnalysis.bmiDeficit && item.targetDeficit === 'bmi') return true;
        if (item.targetDeficit === 'general') return true;
        return false;
      });
    }

    return NUTRITION_FOOD_ITEMS.filter((item) => item.category === categoryFilter);
  }, [childAnalysis, categoryFilter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
              Personalized Nutrition Therapy
            </span>
            <span className="text-xs text-[#7A8676]">Visual Food Suggestions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2A18] mt-1">
            Child Dietary Prescription & Food Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8676] mt-1 max-w-2xl">
            Select a student to inspect their active nutrient deficits and browse visual, culturally rooted Indian foods tailored to their growth recovery.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#CBD5C0] transition-colors print:hidden"
        >
          <Printer className="h-4 w-4 text-[#4A7C44]" />
          <span>Print Diet Prescription</span>
        </button>
      </div>

      {/* Student Selector Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-[#1B2A18] uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4 text-[#4A7C44]" />
            <span>Select Student to Prescribe Diet:</span>
          </label>

          <select
            value={activeChildId}
            onChange={(e) => {
              setActiveChildId(e.target.value);
              onSelectChild(e.target.value);
            }}
            className="px-4 py-2 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-semibold bg-[#F4F7F2] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
          >
            {childrenList.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} • {child.age}y ({child.gender}) • {child.mandalName || 'Mandal'}
              </option>
            ))}
          </select>
        </div>

        {/* Active Child Summary Dossier */}
        {activeChild && childAnalysis && (
          <div className="p-5 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#1B2A18]">{activeChild.name}</h2>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                      childAnalysis.status === 'Good Nutrition'
                        ? 'bg-[#4A7C44]/15 text-[#4A7C44] border-[#4A7C44]/40'
                        : childAnalysis.status === 'Needs Improvement'
                        ? 'bg-[#A88B45]/15 text-[#A88B45] border-[#A88B45]/40'
                        : 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/40'
                    }`}
                  >
                    {childAnalysis.status}
                  </span>
                </div>
                <p className="text-xs text-[#7A8676] mt-1">
                  ID: <span className="font-mono">{activeChild.id}</span> • {activeChild.age} yrs old •{' '}
                  <span className="capitalize">{activeChild.gender}</span> • {activeChild.schoolGrade || 'Primary School'} •{' '}
                  <span className="font-semibold text-[#1B2A18]">{activeChild.mandalName || 'Kuppam Mandal'}</span>
                </p>
              </div>

              {/* Anthropometrics */}
              <div className="flex items-center gap-4 text-center">
                <div className="bg-white px-3 py-1.5 rounded-lg border border-[#CBD5C0]">
                  <p className="text-xs font-bold text-[#1B2A18] font-mono">{activeChild.height} cm</p>
                  <p className="text-[10px] text-[#7A8676]">Height</p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-[#CBD5C0]">
                  <p className="text-xs font-bold text-[#1B2A18] font-mono">{activeChild.weight} kg</p>
                  <p className="text-[10px] text-[#7A8676]">Weight</p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-[#CBD5C0]">
                  <p className="text-xs font-bold text-[#4A7C44] font-mono">{childAnalysis.bmi}</p>
                  <p className="text-[10px] text-[#7A8676]">{childAnalysis.bmiCategory}</p>
                </div>
              </div>
            </div>

            {/* Deficit Alert Chips */}
            <div className="pt-3 border-t border-[#CBD5C0] flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">
                Identified Deficits:
              </span>

              {childAnalysis.eggDeficit ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30">
                  <Egg className="h-3.5 w-3.5" />
                  Protein Deficit ({activeChild.eggIntake} eggs/wk vs target 4+)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F0F4EF] text-[#4A7C44] border border-[#4A7C44]/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Egg Intake Adequate ({activeChild.eggIntake}/wk)
                </span>
              )}

              {childAnalysis.milkDeficit ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]">
                  <Milk className="h-3.5 w-3.5" />
                  Calcium Deficit ({activeChild.milkIntake} milk/wk)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F0F4EF] text-[#4A7C44] border border-[#4A7C44]/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Daily Milk ({activeChild.milkIntake})
                </span>
              )}

              {childAnalysis.vegetableDeficit ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30">
                  <Salad className="h-3.5 w-3.5" />
                  Micronutrient / Iron Deficit ({activeChild.vegetableIntake})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F0F4EF] text-[#4A7C44] border border-[#4A7C44]/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Vegetables Adequate
                </span>
              )}

              {childAnalysis.bmiDeficit && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]">
                  <Flame className="h-3.5 w-3.5" />
                  Caloric Growth Catch-Up Needed ({childAnalysis.bmiCategory})
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'tailored', label: `Tailored for ${activeChild?.name?.split(' ')[0] || 'Student'}` },
          { id: 'all', label: 'All Nutrition Foods' },
          { id: 'protein', label: 'Eggs & Bioavailable Protein' },
          { id: 'calcium', label: 'Fortified Milk & Calcium' },
          { id: 'iron_vitamins', label: 'Moringa & Green Vegetables' },
          { id: 'energy_dense', label: 'Ragi Malt & Energy Dense' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === tab.id
                ? 'bg-[#4A7C44] text-white shadow-xs'
                : 'bg-white text-[#2D3628] border border-[#E0E7DB] hover:bg-[#F4F7F2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => {
          const isDirectMatch =
            childAnalysis &&
            ((childAnalysis.eggDeficit && food.targetDeficit === 'egg') ||
              (childAnalysis.milkDeficit && food.targetDeficit === 'milk') ||
              (childAnalysis.vegetableDeficit && food.targetDeficit === 'vegetable') ||
              (childAnalysis.bmiDeficit && food.targetDeficit === 'bmi'));

          return (
            <div
              key={food.id}
              className={`bg-white rounded-2xl overflow-hidden border shadow-xs flex flex-col justify-between transition-all ${
                isDirectMatch
                  ? 'border-[#4A7C44] ring-2 ring-[#4A7C44]/20'
                  : 'border-[#E0E7DB] hover:border-[#CBD5C0]'
              }`}
            >
              {/* Food Image Container */}
              <div>
                <div className="relative h-48 w-full bg-[#F4F7F2] overflow-hidden">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {isDirectMatch && (
                      <span className="bg-[#4A7C44] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Prescribed Match
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                    {food.calories}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#1B2A18] leading-snug">{food.name}</h3>
                    {food.localName && (
                      <p className="text-xs text-[#7A8676] font-medium">{food.localName}</p>
                    )}
                  </div>

                  {/* Nutrition highlights */}
                  <div className="space-y-1">
                    {food.nutritionHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#2D3628]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4A7C44]" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Portion */}
                  <div className="p-3 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">
                      Target Portion for {activeChild?.name || 'Child'}
                    </p>
                    <p className="text-xs font-semibold text-[#1B2A18] mt-0.5">
                      {food.recommendedServing}
                    </p>
                  </div>

                  {/* Preparation guideline */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">
                      Preparation & Kitchen Tips:
                    </p>
                    <p className="text-xs text-[#7A8676] mt-0.5 leading-relaxed">
                      {food.cookingGuideline}
                    </p>
                  </div>

                  {/* Mid day meal tip */}
                  <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#F3E5AB]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#A88B45]">
                      Mid-Day Meal / Anganwadi Protocol
                    </p>
                    <p className="text-xs text-[#2D3628] mt-0.5">{food.anganwadiMealTip}</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    alert(`Prescribed ${food.name} for ${activeChild?.name}. Added to Anganwadi feeding log!`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs border border-[#CBD5C0] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Heart className="h-3.5 w-3.5 text-[#4A7C44]" />
                  <span>Add to Student Feeding Plan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
