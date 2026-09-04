import React, { useState } from 'react';
import { ChildRecord, Gender, MilkIntake, VegetableIntake, Mandal } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';
import {
  UserPlus,
  Egg,
  Milk,
  Salad,
  Scale,
  Ruler,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  School,
  AlertCircle,
} from 'lucide-react';

interface AddChildPageProps {
  mandals: Mandal[];
  onSaveChild: (child: Omit<ChildRecord, 'id' | 'createdAt'>) => void;
  onNavigate: (page: string) => void;
  onSelectChildForFood: (id: string) => void;
}

export const AddChildPage: React.FC<AddChildPageProps> = ({
  mandals,
  onSaveChild,
  onNavigate,
  onSelectChildForFood,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [gender, setGender] = useState<Gender>('female');
  const [height, setHeight] = useState(112);
  const [weight, setWeight] = useState(17.5);
  const [eggIntake, setEggIntake] = useState(2);
  const [milkIntake, setMilkIntake] = useState<MilkIntake>('3-4 times');
  const [vegetableIntake, setVegetableIntake] = useState<VegetableIntake>('1-2 times a week');
  const [mandalId, setMandalId] = useState<string>(mandals[0]?.id || 'mandal-1');
  const [ward, setWard] = useState('Ward 1 - School Tola');
  const [schoolGrade, setSchoolGrade] = useState('Class 1');
  const [guardianContact, setGuardianContact] = useState('+91 98450 ');

  const [formError, setFormError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [justSavedName, setJustSavedName] = useState<string>('');

  // Real-time live analysis preview
  const liveHeightMeters = height > 0 ? height / 100 : 1;
  const liveBmi = Number((weight / (liveHeightMeters * liveHeightMeters)).toFixed(1));

  const selectedMandalObj = mandals.find((m) => m.id === mandalId) || mandals[0];

  const dummyRecord: ChildRecord = {
    id: 'preview',
    name: name.trim() || 'Student Preview',
    age,
    gender,
    height,
    weight,
    eggIntake,
    milkIntake,
    vegetableIntake,
    mandalId,
    mandalName: selectedMandalObj?.name || 'Kuppam Mandal',
    createdAt: new Date().toISOString(),
  };

  const previewAnalysis = analyzeChild(dummyRecord);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter the child’s full name');
      return;
    }

    if (height < 50 || height > 200) {
      setFormError('Please provide a realistic height in cm (50 - 200 cm)');
      return;
    }

    if (weight < 4 || weight > 120) {
      setFormError('Please provide a realistic weight in kg (4 - 120 kg)');
      return;
    }

    const newChildData: Omit<ChildRecord, 'id' | 'createdAt'> = {
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
      ward: ward.trim() || 'Anganwadi Sector',
      schoolGrade: schoolGrade.trim() || 'Primary School',
      guardianContact: guardianContact.trim() || '+91 98450 00000',
    };

    onSaveChild(newChildData);
    setJustSavedName(name.trim());
    setSavedSuccess(true);
  };

  const handleResetForm = () => {
    setName('');
    setAge(6);
    setHeight(112);
    setWeight(17.5);
    setEggIntake(2);
    setMilkIntake('3-4 times');
    setVegetableIntake('1-2 times a week');
    setSavedSuccess(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
              Enrollment Portal
            </span>
            <span className="text-xs text-[#7A8676]">Dynamic Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2A18] mt-1">
            Register New Student or Anganwadi Child
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8676] mt-1 max-w-2xl">
            Input student anthropometric measurements and 3-pillar dietary intake. Real-time WHO clinical diagnosis will calculate instantly.
          </p>
        </div>

        <button
          onClick={() => onNavigate('records')}
          className="px-4 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs sm:text-sm border border-[#CBD5C0] transition-colors"
        >
          View All Records
        </button>
      </div>

      {savedSuccess ? (
        <div className="bg-white rounded-2xl p-8 border border-[#4A7C44]/40 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F0F4EF] text-[#4A7C44] flex items-center justify-center mx-auto border border-[#4A7C44]/30 shadow-xs">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#1B2A18]">Student Successfully Registered!</h2>
            <p className="text-sm text-[#7A8676]">
              <span className="font-bold text-[#1B2A18]">{justSavedName}</span> has been stored into the village database under{' '}
              <span className="font-semibold text-[#4A7C44]">{selectedMandalObj?.name}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs sm:text-sm border border-[#CBD5C0] transition-colors"
            >
              + Register Another Child
            </button>
            <button
              onClick={() => onNavigate('records')}
              className="px-5 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <span>Go to Child Records Table</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('food-suggestions')}
              className="px-5 py-2.5 rounded-xl bg-[#FFF9E6] hover:bg-[#F3E5AB] text-[#A88B45] font-bold text-xs sm:text-sm border border-[#F3E5AB] flex items-center gap-2 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Inspect Food Suggestions</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Registration Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs space-y-6">
            {formError && (
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8676] mb-3">
                  1. Basic Profile & Administrative Mandal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                      Child Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Reddy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      min={1}
                      max={18}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-mono focus:border-[#4A7C44]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                      Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-semibold bg-[#F4F7F2]"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[#4A7C44]" />
                      <span>Assigned Mandal *</span>
                    </label>
                    <select
                      value={mandalId}
                      onChange={(e) => setMandalId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-semibold bg-[#F4F7F2]"
                    >
                      {mandals.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                      Ward / Habitation / Tola
                    </label>
                    <input
                      type="text"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder="e.g. Ward 2 - South Basti"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                      School Grade / Anganwadi Section
                    </label>
                    <input
                      type="text"
                      value={schoolGrade}
                      onChange={(e) => setSchoolGrade(e.target.value)}
                      placeholder="e.g. Class 2 or Anganwadi Senior"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                      Guardian Phone Contact
                    </label>
                    <input
                      type="text"
                      value={guardianContact}
                      onChange={(e) => setGuardianContact(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Anthropometrics */}
              <div className="pt-4 border-t border-[#E0E7DB]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8676] mb-3">
                  2. Anthropometric Measurements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5 text-[#4A7C44]" />
                      <span>Standing Height (cm) *</span>
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min={50}
                      max={200}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-mono focus:border-[#4A7C44]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider flex items-center gap-1">
                      <Scale className="h-3.5 w-3.5 text-[#4A7C44]" />
                      <span>Body Weight (kg) *</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      min={4}
                      max={120}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] font-mono focus:border-[#4A7C44]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: 3 Pillars of Nutrition */}
              <div className="pt-4 border-t border-[#E0E7DB]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8676] mb-3">
                  3. 3-Pillar Dietary Assessment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Egg intake */}
                  <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1B2A18] flex items-center gap-1.5">
                        <Egg className="h-4 w-4 text-[#A88B45]" /> Eggs / Week
                      </span>
                      <span className="font-mono font-bold text-sm text-[#1B2A18]">{eggIntake}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={14}
                      value={eggIntake}
                      onChange={(e) => setEggIntake(Number(e.target.value))}
                      className="w-full accent-[#4A7C44]"
                    />
                    <p className="text-[10px] text-[#7A8676]">Target: Minimum 3-4 eggs weekly</p>
                  </div>

                  {/* Milk intake */}
                  <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-2">
                    <span className="text-xs font-bold text-[#1B2A18] flex items-center gap-1.5">
                      <Milk className="h-4 w-4 text-[#3B82F6]" /> Milk Frequency
                    </span>
                    <select
                      value={milkIntake}
                      onChange={(e) => setMilkIntake(e.target.value as MilkIntake)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5C0] text-xs font-semibold text-[#1B2A18] bg-white"
                    >
                      <option value="1-2 times">1-2 times (Low)</option>
                      <option value="3-4 times">3-4 times (Moderate)</option>
                      <option value="5-6 times">5-6 times (Optimal)</option>
                      <option value="7 or more times">Daily / 7+ times</option>
                    </select>
                    <p className="text-[10px] text-[#7A8676]">Target: Daily fortified milk</p>
                  </div>

                  {/* Vegetable intake */}
                  <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] space-y-2">
                    <span className="text-xs font-bold text-[#1B2A18] flex items-center gap-1.5">
                      <Salad className="h-4 w-4 text-[#4A7C44]" /> Green Veggies
                    </span>
                    <select
                      value={vegetableIntake}
                      onChange={(e) => setVegetableIntake(e.target.value as VegetableIntake)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5C0] text-xs font-semibold text-[#1B2A18] bg-white"
                    >
                      <option value="rarely">Rarely (Severe deficit)</option>
                      <option value="1-2 times a week">1-2 times/week</option>
                      <option value="3-4 times a week">3-4 times/week (Optimal)</option>
                    </select>
                    <p className="text-[10px] text-[#7A8676]">Target: Moringa / Leafy greens</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#E0E7DB]">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-sm shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Register Student & Save to Village Database</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Live Diagnosis Preview Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-xs space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#E0E7DB]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88B45]">
                  Live Clinical Assessment
                </span>
                <span className="w-2 h-2 rounded-full bg-[#4A7C44] animate-ping" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#1B2A18]">
                  {name.trim() || 'New Child'}
                </h4>
                <p className="text-xs text-[#7A8676]">
                  {age} yrs • <span className="capitalize">{gender}</span> • {selectedMandalObj?.name}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Estimated BMI</p>
                <p className="text-3xl font-black text-[#1B2A18] font-mono">{liveBmi}</p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                    previewAnalysis.status === 'Good Nutrition'
                      ? 'bg-[#4A7C44]/15 text-[#4A7C44] border-[#4A7C44]/40'
                      : previewAnalysis.status === 'Needs Improvement'
                      ? 'bg-[#A88B45]/15 text-[#A88B45] border-[#A88B45]/40'
                      : 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/40'
                  }`}
                >
                  {previewAnalysis.status}
                </span>
              </div>

              {/* Warning flags if any */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">Clinical Indicators:</p>
                {previewAnalysis.warnings.length === 0 ? (
                  <p className="text-xs text-[#4A7C44] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Balanced intake parameters
                  </p>
                ) : (
                  previewAnalysis.warnings.map((w, i) => (
                    <div key={i} className="text-xs text-[#DC2626] flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                      <span>{w}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#F3E5AB] text-[11px] text-[#A88B45]">
                <p className="font-bold">Automated Protocol:</p>
                <p className="text-[#7A8676] mt-0.5 leading-relaxed">
                  Saving will generate a tailored Anganwadi meal prescription with high-protein food suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
