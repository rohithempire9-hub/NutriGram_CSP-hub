import React from 'react';
import { ChildRecord } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';
import {
  ArrowLeft,
  Printer,
  Sparkles,
  Egg,
  Milk,
  Salad,
  Scale,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  School,
  Edit,
  Utensils,
} from 'lucide-react';

interface ChildDetailPageProps {
  child: ChildRecord | null;
  onBack: () => void;
  onEdit: (child: ChildRecord) => void;
  onViewFoodSuggestions: (childId: string) => void;
}

export const ChildDetailPage: React.FC<ChildDetailPageProps> = ({
  child,
  onBack,
  onEdit,
  onViewFoodSuggestions,
}) => {
  if (!child) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-[#E0E7DB] shadow-xs space-y-4">
        <p className="text-[#7A8676]">No child selected or record not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#4A7C44] text-white font-bold text-xs"
        >
          Return to Records
        </button>
      </div>
    );
  }

  const analysis = analyzeChild(child);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation & Print Top Bar */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1B2A18] bg-white border border-[#CBD5C0] hover:bg-[#F4F7F2] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Records</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(child)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1B2A18] bg-[#F0F4EF] hover:bg-[#E0E7DB] border border-[#CBD5C0] transition-colors"
          >
            <Edit className="h-4 w-4 text-[#4A7C44]" />
            <span>Edit Record</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1B2A18] hover:bg-[#2D3628] shadow-xs transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Health Card</span>
          </button>
        </div>
      </div>

      {/* Main Student Profile Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs space-y-6">
        {/* Header with Avatar & Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E0E7DB]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F0F4EF] text-[#4A7C44] flex items-center justify-center font-bold text-2xl border border-[#CBD5C0] shadow-xs font-mono">
              {child.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-[#1B2A18]">{child.name}</h1>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                    analysis.status === 'Good Nutrition'
                      ? 'bg-[#4A7C44]/15 text-[#4A7C44] border-[#4A7C44]/40'
                      : analysis.status === 'Needs Improvement'
                      ? 'bg-[#A88B45]/15 text-[#A88B45] border-[#A88B45]/40'
                      : 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/40'
                  }`}
                >
                  {analysis.status}
                </span>
              </div>
              <p className="text-xs text-[#7A8676] mt-1 flex flex-wrap items-center gap-3">
                <span>
                  ID: <strong className="font-mono text-[#1B2A18]">{child.id}</strong>
                </span>
                <span>•</span>
                <span>
                  {child.age} yrs old (<span className="capitalize">{child.gender}</span>)
                </span>
                <span>•</span>
                <span className="font-semibold text-[#1B2A18]">{child.schoolGrade || 'Primary School'}</span>
              </p>
            </div>
          </div>

          <div className="bg-[#F4F7F2] px-4 py-2.5 rounded-xl border border-[#CBD5C0] text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Mandal Jurisdiction</p>
            <p className="text-sm font-bold text-[#1B2A18]">{child.mandalName || 'Kuppam Mandal'}</p>
            <p className="text-[10px] text-[#7A8676]">{child.ward || 'Ward 1'}</p>
          </div>
        </div>

        {/* CTA: Personal Food Suggestions Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F0F4EF] via-white to-[#F0F4EF] border border-[#4A7C44]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A7C44] text-white flex items-center justify-center shrink-0">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1B2A18]">
                Prescribed Nutrition Diet for {child.name}
              </h3>
              <p className="text-xs text-[#7A8676]">
                Targeting active deficits in eggs, milk, and iron-rich green vegetables.
              </p>
            </div>
          </div>

          <button
            onClick={() => onViewFoodSuggestions(child.id)}
            className="px-5 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs shadow-xs flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Visual Food Menu</span>
          </button>
        </div>

        {/* Anthropometric Stats */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8676] mb-3">
            Anthropometric Measurements & Clinical BMI
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
              <div className="flex items-center justify-between text-[#7A8676]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Height</span>
                <Ruler className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-[#1B2A18] font-mono mt-1">{child.height} cm</p>
              <p className="text-xs text-[#7A8676] mt-0.5">Standing stature</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
              <div className="flex items-center justify-between text-[#7A8676]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Weight</span>
                <Scale className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-[#1B2A18] font-mono mt-1">{child.weight} kg</p>
              <p className="text-xs text-[#7A8676] mt-0.5">Calibrated scale</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB]">
              <div className="flex items-center justify-between text-[#7A8676]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Body Mass Index</span>
                <span className="text-xs font-bold text-[#4A7C44] font-mono">{analysis.bmi}</span>
              </div>
              <p className="text-xl font-bold text-[#1B2A18] mt-1">{analysis.bmiCategory}</p>
              <p className="text-xs text-[#7A8676] mt-0.5">WHO Indian percentile</p>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Nutrition Status */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8676] mb-3">
            3-Pillar Dietary Assessment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Egg */}
            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B2A18] flex items-center gap-1.5">
                  <Egg className="h-4 w-4 text-[#A88B45]" /> Weekly Eggs
                </span>
                <span className="font-mono font-bold text-sm text-[#1B2A18]">{child.eggIntake} / wk</span>
              </div>
              <p className="text-xs text-[#7A8676]">
                {child.eggIntake >= 3 ? 'Meets recommended animal protein' : 'Deficit in choline & complete protein'}
              </p>
            </div>

            {/* Milk */}
            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B2A18] flex items-center gap-1.5">
                  <Milk className="h-4 w-4 text-[#3B82F6]" /> Milk Intake
                </span>
                <span className="font-semibold text-xs text-[#1B2A18]">{child.milkIntake}</span>
              </div>
              <p className="text-xs text-[#7A8676]">
                {child.milkIntake === '7 or more times'
                  ? 'Daily calcium mineralization active'
                  : 'Sub-optimal calcium for bone growth'}
              </p>
            </div>

            {/* Vegetables */}
            <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B2A18] flex items-center gap-1.5">
                  <Salad className="h-4 w-4 text-[#4A7C44]" /> Green Veggies
                </span>
                <span className="font-semibold text-xs text-[#1B2A18]">{child.vegetableIntake}</span>
              </div>
              <p className="text-xs text-[#7A8676]">
                {child.vegetableIntake === '3-4 times a week'
                  ? 'Adequate dietary iron and Vitamin A'
                  : 'High risk of micro-nutrient anemia'}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8676]">
            Prescribed Anganwadi & Mid-Day Meal Roadmap
          </h3>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] text-xs text-[#2D3628] flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-[#4A7C44]/20 text-[#4A7C44] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guardian Contact Info */}
        <div className="pt-4 border-t border-[#E0E7DB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A8676]">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#4A7C44]" />
            <span>Guardian Phone: <strong className="font-mono text-[#1B2A18]">{child.guardianContact || 'None provided'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Registered on: {new Date(child.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
