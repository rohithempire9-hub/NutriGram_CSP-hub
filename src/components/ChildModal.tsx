import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Egg, Milk, Salad } from 'lucide-react';
import { ChildRecord, Gender, MilkIntake, VegetableIntake, Mandal } from '../types';
import { analyzeChild, calculateBMI } from '../utils/nutritionCalculations';

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (childData: Omit<ChildRecord, 'id' | 'createdAt'>, existingId?: string) => void;
  childToEdit?: ChildRecord | null;
  mandals?: Mandal[];
}

export const ChildModal: React.FC<ChildModalProps> = ({
  isOpen,
  onClose,
  onSave,
  childToEdit,
  mandals = [],
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [gender, setGender] = useState<Gender>('female');
  const [height, setHeight] = useState(110);
  const [weight, setWeight] = useState(18);
  const [eggIntake, setEggIntake] = useState(3);
  const [milkIntake, setMilkIntake] = useState<MilkIntake>('3-4 times');
  const [vegetableIntake, setVegetableIntake] = useState<VegetableIntake>('3-4 times a week');
  const [mandalId, setMandalId] = useState<string>(mandals[0]?.id || 'mandal-1');
  const [ward, setWard] = useState('Ward 1 - School Tola');
  const [schoolGrade, setSchoolGrade] = useState('Class 1');
  const [guardianContact, setGuardianContact] = useState('');

  // When editing, populate existing child info
  useEffect(() => {
    if (childToEdit) {
      setName(childToEdit.name);
      setAge(childToEdit.age);
      setGender(childToEdit.gender);
      setHeight(childToEdit.height);
      setWeight(childToEdit.weight);
      setEggIntake(childToEdit.eggIntake);
      setMilkIntake(childToEdit.milkIntake);
      setVegetableIntake(childToEdit.vegetableIntake);
      setMandalId(childToEdit.mandalId || mandals[0]?.id || 'mandal-1');
      setWard(childToEdit.ward || 'Ward 1 - School Tola');
      setSchoolGrade(childToEdit.schoolGrade || 'Class 1');
      setGuardianContact(childToEdit.guardianContact || '');
    } else {
      setName('');
      setAge(6);
      setGender('female');
      setHeight(110);
      setWeight(17.5);
      setEggIntake(3);
      setMilkIntake('3-4 times');
      setVegetableIntake('3-4 times a week');
      setMandalId(mandals[0]?.id || 'mandal-1');
      setWard('Ward 1 - School Tola');
      setSchoolGrade('Class 1');
      setGuardianContact('');
    }
  }, [childToEdit, isOpen, mandals]);

  if (!isOpen) return null;

  // Real-time calculated status preview
  const livePreview = analyzeChild({
    name: name || 'Child Name',
    age,
    gender,
    height,
    weight,
    eggIntake,
    milkIntake,
    vegetableIntake,
    mandalId,
  });

  const selectedMandalObj = mandals.find((m) => m.id === mandalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        eggIntake: Number(eggIntake),
        milkIntake,
        vegetableIntake,
        mandalId,
        mandalName: selectedMandalObj?.name || 'Kuppam Mandal',
        ward,
        schoolGrade,
        guardianContact: guardianContact.trim() || undefined,
      },
      childToEdit ? childToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-[#E0E7DB] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1B2A18] text-white flex items-center justify-between border-b border-[#2D3628]">
          <div>
            <span className="text-[10px] font-bold text-[#F3E5AB] uppercase tracking-wider">
              {childToEdit ? 'Modify Record' : 'New Anganwadi Registration'}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
              {childToEdit ? `Edit ${childToEdit.name}` : 'Register Village Child'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#CBD5C0] hover:text-white rounded-xl hover:bg-[#2D3628] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Live Nutrition Status Banner Preview */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
              livePreview.status === 'Good Nutrition'
                ? 'bg-[#F0F4EF] border-[#CBD5C0] text-[#1B2A18]'
                : livePreview.status === 'Needs Improvement'
                ? 'bg-[#FFF9E6] border-[#F3E5AB] text-[#A88B45]'
                : 'bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]'
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#4A7C44]" /> Live Status Preview
              </span>
              <div className="text-sm font-bold mt-0.5">
                {livePreview.status} • BMI {livePreview.bmi} ({livePreview.bmiCategory})
              </div>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                livePreview.status === 'Good Nutrition'
                  ? 'bg-white text-[#4A7C44] border-[#CBD5C0]'
                  : livePreview.status === 'Needs Improvement'
                  ? 'bg-white text-[#A88B45] border-[#F3E5AB]'
                  : 'bg-white text-[#DC2626] border-[#FECACA]'
              }`}
            >
              {livePreview.warningCount === 0
                ? 'Optimal'
                : `${livePreview.warningCount} Warning${livePreview.warningCount > 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Child Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
              Child Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Kumar"
              className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
            />
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
                Age (1-18 yrs) *
              </label>
              <input
                type="number"
                min="1"
                max="18"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              >
                <option value="female">Female (Girl)</option>
                <option value="male">Male (Boy)</option>
              </select>
            </div>
          </div>

          {/* Assigned Mandal */}
          {mandals.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
                Administrative Mandal *
              </label>
              <select
                value={mandalId}
                onChange={(e) => setMandalId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              >
                {mandals.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.district})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Height and Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
                Height (cm) *
              </label>
              <input
                type="number"
                min="30"
                max="200"
                step="0.5"
                required
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                min="2"
                max="100"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44] font-mono"
              />
            </div>
          </div>

          {/* 3 Pillars of Nutrition (Eggs, Milk, Vegetables) */}
          <div className="pt-2 border-t border-[#E0E7DB]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B2A18] block mb-3">
              Weekly Nutrition Intake Tracking
            </span>

            {/* Eggs Per Week */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-[#1B2A18] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Egg className="h-4 w-4 text-[#A88B45]" /> Eggs Consumed Per Week *
                </span>
                <span className="text-xs font-mono font-bold text-[#A88B45] bg-[#FFF9E6] border border-[#F3E5AB] px-2 py-0.5 rounded">
                  {eggIntake} eggs/wk
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="14"
                value={eggIntake}
                onChange={(e) => setEggIntake(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              />
              <p className="text-[11px] text-[#7A8676] mt-1">
                Target is &ge; 3-4 eggs weekly. Below 3 triggers protein warning.
              </p>
            </div>

            {/* Milk Intake */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-[#1B2A18] mb-1 flex items-center gap-1.5">
                <Milk className="h-4 w-4 text-[#3B82F6]" /> Milk Consumption Frequency *
              </label>
              <select
                value={milkIntake}
                onChange={(e) => setMilkIntake(e.target.value as MilkIntake)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              >
                <option value="1-2 times">1-2 times (Low)</option>
                <option value="3-4 times">3-4 times (Moderate)</option>
                <option value="5-6 times">5-6 times (Good)</option>
                <option value="7 or more times">7 or more times (Daily Optimal)</option>
              </select>
            </div>

            {/* Vegetable Intake */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-[#1B2A18] mb-1 flex items-center gap-1.5">
                <Salad className="h-4 w-4 text-[#10B981]" /> Green Vegetable Intake *
              </label>
              <select
                value={vegetableIntake}
                onChange={(e) => setVegetableIntake(e.target.value as VegetableIntake)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              >
                <option value="3-4 times a week">3-4 times a week (Optimal)</option>
                <option value="1-2 times a week">1-2 times a week (Inadequate)</option>
                <option value="rarely">Rarely (Severe Micronutrient Deficit)</option>
              </select>
            </div>
          </div>

          {/* School Grade & Village Ward */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E0E7DB]">
            <div>
              <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
                Class / Grade
              </label>
              <input
                type="text"
                value={schoolGrade}
                onChange={(e) => setSchoolGrade(e.target.value)}
                placeholder="e.g. Class 2 or Anganwadi"
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B2A18] uppercase tracking-wider mb-1">
                Village Ward / Area
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. Ward 2 - South Basti"
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#E0E7DB] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#7A8676] hover:text-[#1B2A18] hover:bg-[#F0F4EF] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#4A7C44] hover:bg-[#3e6839] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>{childToEdit ? 'Save Changes' : 'Register Child'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
