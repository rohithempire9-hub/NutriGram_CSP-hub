import React, { useState, useMemo } from 'react';
import { Search, Filter, Egg, Milk, Salad, Eye, Edit2, Trash2, UserPlus, FileText, ChevronDown } from 'lucide-react';
import { ChildRecord, NutritionStatus, Gender } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';

interface ChildrenTableProps {
  childrenList: ChildRecord[];
  selectedFilter: NutritionStatus | 'All';
  onSelectFilter: (filter: NutritionStatus | 'All') => void;
  onViewChild: (child: ChildRecord) => void;
  onEditChild: (child: ChildRecord) => void;
  onDeleteChild: (id: string) => void;
  onOpenAddModal: () => void;
}

export const ChildrenTable: React.FC<ChildrenTableProps> = ({
  childrenList,
  selectedFilter,
  onSelectFilter,
  onViewChild,
  onEditChild,
  onDeleteChild,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'All' | Gender>('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'bmi' | 'eggs'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Unique wards for filter
  const wards = useMemo(() => {
    const set = new Set<string>();
    childrenList.forEach((c) => {
      if (c.ward) set.add(c.ward);
    });
    return Array.from(set).sort();
  }, [childrenList]);

  // Filtered and sorted children
  const filteredChildren = useMemo(() => {
    return childrenList
      .filter((child) => {
        const analysis = analyzeChild(child);

        // Status filter
        if (selectedFilter !== 'All' && analysis.status !== selectedFilter) {
          return false;
        }

        // Gender filter
        if (selectedGender !== 'All' && child.gender !== selectedGender) {
          return false;
        }

        // Ward filter
        if (selectedWard !== 'All' && child.ward !== selectedWard) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = child.name.toLowerCase().includes(query);
          const matchWard = (child.ward || '').toLowerCase().includes(query);
          const matchGrade = (child.schoolGrade || '').toLowerCase().includes(query);
          if (!matchName && !matchWard && !matchGrade) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') {
          diff = a.name.localeCompare(b.name);
        } else if (sortBy === 'age') {
          diff = a.age - b.age;
        } else if (sortBy === 'bmi') {
          const bmiA = analyzeChild(a).bmi;
          const bmiB = analyzeChild(b).bmi;
          diff = bmiA - bmiB;
        } else if (sortBy === 'eggs') {
          diff = a.eggIntake - b.eggIntake;
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [childrenList, selectedFilter, selectedGender, selectedWard, searchQuery, sortBy, sortOrder]);

  return (
    <div className="bg-white rounded-2xl border border-[#E0E7DB] shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-[#E0E7DB] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8676]">
              Village Cohort Records
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#1B2A18] mt-0.5">
              Individual Child Nutrition Registry
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#F0F4EF] text-[#1B2A18] border border-[#CBD5C0]">
              Showing {filteredChildren.length} of {childrenList.length} children
            </span>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#4A7C44] hover:bg-[#3e6839] px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Register Child</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7A8676]" />
            <input
              type="text"
              placeholder="Search by child name, ward, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-xs sm:text-sm text-[#1B2A18] placeholder-[#7A8676] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44] transition-all"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedFilter}
              onChange={(e) => onSelectFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-xs sm:text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44] cursor-pointer font-medium"
            >
              <option value="All">Status: All Records</option>
              <option value="Good Nutrition">Status: Good Nutrition</option>
              <option value="Needs Improvement">Status: Needs Improvement</option>
              <option value="At Risk">Status: At Risk</option>
            </select>
          </div>

          {/* Gender filter */}
          <div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="w-full py-2 px-3 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-xs sm:text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44] cursor-pointer font-medium"
            >
              <option value="All">Gender: All</option>
              <option value="female">Girls Only</option>
              <option value="male">Boys Only</option>
            </select>
          </div>

          {/* Sort selector */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              className="w-full py-2 px-3 bg-[#F9FAFB] border border-[#E0E7DB] rounded-xl text-xs sm:text-sm text-[#1B2A18] focus:outline-none focus:ring-2 focus:ring-[#4A7C44]/20 focus:border-[#4A7C44] cursor-pointer font-medium"
            >
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="bmi-asc">Sort: BMI (Lowest first)</option>
              <option value="bmi-desc">Sort: BMI (Highest first)</option>
              <option value="eggs-asc">Sort: Eggs (Least first)</option>
              <option value="eggs-desc">Sort: Eggs (Most first)</option>
              <option value="age-asc">Sort: Age (Youngest first)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E0E7DB] text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">
              <th className="py-3 px-4 sm:px-6">Child Name & Age</th>
              <th className="py-3 px-4">Height / Weight (BMI)</th>
              <th className="py-3 px-4 text-center">Eggs / Wk</th>
              <th className="py-3 px-4">Milk Intake</th>
              <th className="py-3 px-4">Vegetables</th>
              <th className="py-3 px-4 text-center">Nutritional Status</th>
              <th className="py-3 px-4 text-right sm:pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E7DB] text-xs sm:text-sm text-[#2D3628]">
            {filteredChildren.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#7A8676]">
                  <p className="text-base font-semibold text-[#1B2A18]">No child records found</p>
                  <p className="text-xs text-[#7A8676] mt-1">Try adjusting your filters or search terms</p>
                </td>
              </tr>
            ) : (
              filteredChildren.map((child) => {
                const analysis = analyzeChild(child);
                const isGirl = child.gender === 'female';

                return (
                  <tr
                    key={child.id}
                    id={`child-row-${child.id}`}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    {/* Name & Basic Info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isGirl
                              ? 'bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]'
                              : 'bg-[#E6F4FF] text-[#1E40AF] border border-[#BDE0FF]'
                          }`}
                        >
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#1B2A18] group-hover:text-[#4A7C44] transition-colors">
                            {child.name}
                          </div>
                          <div className="text-[11px] text-[#7A8676] flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="font-medium">{child.age} yrs</span>
                            <span>•</span>
                            <span className="capitalize">{child.gender}</span>
                            {child.schoolGrade && (
                              <>
                                <span>•</span>
                                <span className="text-[#1B2A18] font-medium">{child.schoolGrade}</span>
                              </>
                            )}
                            {child.ward && (
                              <span className="hidden md:inline text-[10px] text-[#7A8676]">
                                ({child.ward})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Height, Weight & BMI */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#1B2A18] text-xs">
                            BMI {analysis.bmi}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              analysis.bmi < 13.0
                                ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                                : analysis.bmi < 14.5
                                ? 'bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]'
                                : 'bg-[#E6F4E6] text-[#4A7C44] border border-[#C6E0C6]'
                            }`}
                          >
                            {analysis.bmiCategory}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7A8676] mt-0.5">
                          {child.height} cm • {child.weight} kg
                        </div>
                      </div>
                    </td>

                    {/* Eggs Per Week */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-bold font-mono text-xs px-2.5 py-1 rounded-full border ${
                          child.eggIntake >= 5
                            ? 'bg-[#E6F4E6] text-[#065F46] border-[#C6E0C6]'
                            : child.eggIntake >= 3
                            ? 'bg-[#E6F4E6] text-[#065F46] border-[#C6E0C6]'
                            : child.eggIntake > 0
                            ? 'bg-[#FFF9E6] text-[#A88B45] border-[#F3E5AB]'
                            : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA] font-extrabold'
                        }`}
                      >
                        <Egg className="h-3 w-3 inline" />
                        <span>{child.eggIntake} / wk</span>
                      </span>
                    </td>

                    {/* Milk Intake */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Milk className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" />
                        <span
                          className={
                            child.milkIntake === '7 or more times'
                              ? 'text-[#065F46] font-semibold'
                              : child.milkIntake === '5-6 times'
                              ? 'text-[#1E40AF] font-semibold'
                              : 'text-[#A88B45]'
                          }
                        >
                          {child.milkIntake}
                        </span>
                      </div>
                    </td>

                    {/* Vegetable Intake */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Salad className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                        <span
                          className={
                            child.vegetableIntake === '3-4 times a week'
                              ? 'text-[#065F46] font-semibold'
                              : child.vegetableIntake === '1-2 times a week'
                              ? 'text-[#A88B45]'
                              : 'text-[#DC2626] font-semibold'
                          }
                        >
                          {child.vegetableIntake}
                        </span>
                      </div>
                    </td>

                    {/* Overall Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          analysis.status === 'Good Nutrition'
                            ? 'bg-[#E6F4E6] text-[#065F46] border-[#C6E0C6]'
                            : analysis.status === 'Needs Improvement'
                            ? 'bg-[#FFF9E6] text-[#A88B45] border-[#F3E5AB]'
                            : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                        }`}
                      >
                        {analysis.status}
                      </span>
                      {analysis.warningCount > 0 && (
                        <div className="text-[10px] text-[#7A8676] mt-1 font-medium">
                          {analysis.warningCount} risk factor{analysis.warningCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 sm:pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewChild(child)}
                          className="p-1.5 text-[#7A8676] hover:text-[#4A7C44] hover:bg-[#F0F4EF] rounded-lg transition-colors"
                          title="View Nutrition Card"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditChild(child)}
                          className="p-1.5 text-[#7A8676] hover:text-[#3B82F6] hover:bg-[#F0F4EF] rounded-lg transition-colors"
                          title="Edit Child"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${child.name}?`)) {
                              onDeleteChild(child.id);
                            }
                          }}
                          className="p-1.5 text-[#7A8676] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
