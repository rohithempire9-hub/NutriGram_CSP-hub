import React from 'react';
import { X, Printer, Egg, Milk, Salad, Activity, AlertTriangle, CheckCircle2, Heart, Award, ArrowUpRight } from 'lucide-react';
import { ChildRecord } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';

interface ChildDetailModalProps {
  child: ChildRecord | null;
  onClose: () => void;
  onEdit: (child: ChildRecord) => void;
}

export const ChildDetailModal: React.FC<ChildDetailModalProps> = ({ child, onClose, onEdit }) => {
  if (!child) return null;

  const analysis = analyzeChild(child);
  const isGirl = child.gender === 'female';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#E0E7DB] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 bg-[#1B2A18] text-white flex items-center justify-between border-b border-[#2D3628] no-print">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                isGirl
                  ? 'bg-[#2D3628] text-[#F3E5AB] border border-[#A88B45]/40'
                  : 'bg-[#2D3628] text-[#BDE0FF] border border-[#3B82F6]/40'
              }`}
            >
              {child.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-white">{child.name}</h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    analysis.status === 'Good Nutrition'
                      ? 'bg-[#4A7C44]/20 text-[#A3E635] border-[#4A7C44]/40'
                      : analysis.status === 'Needs Improvement'
                      ? 'bg-[#A88B45]/20 text-[#F3E5AB] border-[#A88B45]/40'
                      : 'bg-[#DC2626]/20 text-[#FECACA] border-[#DC2626]/40'
                  }`}
                >
                  {analysis.status}
                </span>
              </div>
              <p className="text-xs text-[#CBD5C0] mt-0.5">
                {child.age} Years • <span className="capitalize">{child.gender}</span> • {child.schoolGrade || 'Anganwadi'} • {child.ward || 'Village Center'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-[#CBD5C0] hover:text-white hover:bg-[#2D3628] rounded-xl transition-colors"
              title="Print Nutrition Card"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#CBD5C0] hover:text-white hover:bg-[#2D3628] rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Header (Shows when printed) */}
        <div className="p-6 border-b border-[#E0E7DB] print-only hidden">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1B2A18]">Gram Panchayat Village Nutrition Card</h1>
            <p className="text-xs text-[#7A8676]">Anganwadi & Primary School Child Health Record</p>
          </div>
          <div className="mt-4 flex justify-between border-t border-b border-[#E0E7DB] py-2 text-xs text-[#2D3628]">
            <span><strong>Name:</strong> {child.name}</span>
            <span><strong>Age:</strong> {child.age} Yrs</span>
            <span><strong>Gender:</strong> {child.gender}</span>
            <span><strong>Ward:</strong> {child.ward || 'Main'}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-[#F0F4EF] rounded-xl border border-[#E0E7DB]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] block">Height</span>
              <span className="text-lg font-bold text-[#1B2A18] font-mono">{child.height} cm</span>
            </div>
            <div className="p-3.5 bg-[#F0F4EF] rounded-xl border border-[#E0E7DB]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] block">Weight</span>
              <span className="text-lg font-bold text-[#1B2A18] font-mono">{child.weight} kg</span>
            </div>
            <div className="p-3.5 bg-[#F0F4EF] rounded-xl border border-[#E0E7DB]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] block">BMI Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-[#1B2A18] font-mono">{analysis.bmi}</span>
                <span className="text-[10px] text-[#7A8676]">kg/m²</span>
              </div>
            </div>
            <div className="p-3.5 bg-[#F0F4EF] rounded-xl border border-[#E0E7DB]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] block">Classification</span>
              <span
                className={`text-xs font-bold block mt-0.5 ${
                  analysis.bmi < 13.0
                    ? 'text-[#DC2626]'
                    : analysis.bmi < 14.5
                    ? 'text-[#A88B45]'
                    : 'text-[#4A7C44]'
                }`}
              >
                {analysis.bmiCategory}
              </span>
            </div>
          </div>

          {/* Nutrition Factors Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B2A18] mb-3">
              Weekly Nutrition Intake Factors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Eggs */}
              <div
                className={`p-3.5 rounded-xl border ${
                  child.eggIntake >= 4
                    ? 'bg-[#F0F4EF] border-[#CBD5C0] text-[#1B2A18]'
                    : child.eggIntake >= 2
                    ? 'bg-[#FFF9E6] border-[#F3E5AB] text-[#A88B45]'
                    : 'bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Egg className="h-4 w-4 text-[#A88B45]" /> Weekly Eggs
                  </span>
                  <span className="font-mono font-bold text-base">{child.eggIntake} / wk</span>
                </div>
                <p className="text-[11px] text-[#2D3628] mt-2">
                  {child.eggIntake >= 4
                    ? 'Meets target protein requirement.'
                    : 'Below recommended 4-6 eggs/wk.'}
                </p>
              </div>

              {/* Milk */}
              <div
                className={`p-3.5 rounded-xl border ${
                  child.milkIntake === '7 or more times' || child.milkIntake === '5-6 times'
                    ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]'
                    : 'bg-[#FFF9E6] border-[#F3E5AB] text-[#A88B45]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Milk className="h-4 w-4 text-[#3B82F6]" /> Milk Intake
                  </span>
                  <span className="font-semibold text-xs text-right">{child.milkIntake}</span>
                </div>
                <p className="text-[11px] text-[#2D3628] mt-2">
                  {child.milkIntake === '7 or more times' || child.milkIntake === '5-6 times'
                    ? 'Adequate calcium intake.'
                    : 'Risk of low bone density.'}
                </p>
              </div>

              {/* Vegetables */}
              <div
                className={`p-3.5 rounded-xl border ${
                  child.vegetableIntake === '3-4 times a week'
                    ? 'bg-[#F0F4EF] border-[#CBD5C0] text-[#1B2A18]'
                    : child.vegetableIntake === '1-2 times a week'
                    ? 'bg-[#FFF9E6] border-[#F3E5AB] text-[#A88B45]'
                    : 'bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Salad className="h-4 w-4 text-[#4A7C44]" /> Vegetables
                  </span>
                  <span className="font-semibold text-xs text-right">{child.vegetableIntake}</span>
                </div>
                <p className="text-[11px] text-[#2D3628] mt-2">
                  {child.vegetableIntake === '3-4 times a week'
                    ? 'Regular dietary fiber & vitamins.'
                    : 'Micronutrient deficit alert.'}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnostic Warnings & Deficits */}
          {analysis.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FFF1F2] border border-[#FECDD3]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9F1239] flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-4 w-4 text-[#E11D48]" />
                Nutritional Warning Flags ({analysis.warningCount})
              </h4>
              <ul className="space-y-1.5 text-xs text-[#881337]">
                {analysis.warnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48] mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations for Anganwadi / Midday Meal Worker */}
          <div className="p-4 rounded-xl bg-[#F0F4EF] border border-[#CBD5C0]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B2A18] flex items-center gap-1.5 mb-2">
              <Award className="h-4 w-4 text-[#4A7C44]" />
              Prescribed Community Action Plan
            </h4>
            <ul className="space-y-1.5 text-xs text-[#2D3628]">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4A7C44] mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F9FAFB] border-t border-[#E0E7DB] flex items-center justify-between no-print">
          <button
            onClick={() => {
              onEdit(child);
              onClose();
            }}
            className="text-xs font-bold text-[#2D3628] hover:text-[#1B2A18] px-3.5 py-2 rounded-xl border border-[#CBD5C0] hover:bg-white transition-colors"
          >
            Edit Child Data
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs font-bold text-[#1B2A18] bg-[#E0E7DB] hover:bg-[#d0dbca] px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="text-xs font-bold text-white bg-[#4A7C44] hover:bg-[#3e6839] px-4 py-2 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
