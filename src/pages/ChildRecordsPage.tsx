import React, { useState, useMemo } from 'react';
import { ChildRecord, FilterStatus, Mandal } from '../types';
import { analyzeChild } from '../utils/nutritionCalculations';
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Trash2,
  Edit,
  Utensils,
  Layers,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';

interface ChildRecordsPageProps {
  childrenList: ChildRecord[];
  mandals: Mandal[];
  initialMandalFilter?: string;
  onSelectChild: (id: string) => void;
  onEditChild: (child: ChildRecord) => void;
  onDeleteChild: (id: string) => void;
  onNavigate: (page: string) => void;
  onSelectChildForFood: (id: string) => void;
}

export const ChildRecordsPage: React.FC<ChildRecordsPageProps> = ({
  childrenList,
  mandals,
  initialMandalFilter,
  onSelectChild,
  onEditChild,
  onDeleteChild,
  onNavigate,
  onSelectChildForFood,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [mandalFilter, setMandalFilter] = useState<string>(initialMandalFilter || 'all');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'bmi' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort logic
  const filteredAndSortedChildren = useMemo(() => {
    return childrenList
      .filter((child) => {
        const matchesSearch =
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (child.ward && child.ward.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        // Mandal filter
        if (mandalFilter !== 'all') {
          const matchMandal =
            child.mandalName === mandalFilter || child.mandalId === mandalFilter;
          if (!matchMandal) return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          const analysis = analyzeChild(child);
          if (statusFilter === 'good' && analysis.status !== 'Good Nutrition') return false;
          if (statusFilter === 'needs-improvement' && analysis.status !== 'Needs Improvement')
            return false;
          if (statusFilter === 'at-risk' && analysis.status !== 'At Risk') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortBy === 'age') {
          return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
        }
        if (sortBy === 'bmi') {
          const bmiA = a.weight / ((a.height / 100) * (a.height / 100));
          const bmiB = b.weight / ((b.height / 100) * (b.height / 100));
          return sortOrder === 'asc' ? bmiA - bmiB : bmiB - bmiA;
        }
        // Date sort
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [childrenList, searchTerm, statusFilter, mandalFilter, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Age',
      'Gender',
      'Height(cm)',
      'Weight(kg)',
      'BMI',
      'BMI Category',
      'Eggs/Wk',
      'Milk Intake',
      'Vegetable Intake',
      'Mandal',
      'Ward',
      'Status',
    ];

    const rows = filteredAndSortedChildren.map((child) => {
      const a = analyzeChild(child);
      return [
        child.id,
        `"${child.name}"`,
        child.age,
        child.gender,
        child.height,
        child.weight,
        a.bmi,
        `"${a.bmiCategory}"`,
        child.eggIntake,
        `"${child.milkIntake}"`,
        `"${child.vegetableIntake}"`,
        `"${child.mandalName || 'Mandal'}"`,
        `"${child.ward || ''}"`,
        `"${a.status}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `nutrigram_child_records_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
              Village Census Dashboard
            </span>
            <span className="text-xs text-[#7A8676]">Dynamic Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2A18] mt-1">
            Child Nutrition & Health Records
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8676] mt-1 max-w-2xl">
            Live database of registered children across all village Mandals. Inspect individual dietary deficiencies, BMI scores, and export records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#CBD5C0] transition-colors"
          >
            <Download className="h-4 w-4 text-[#4A7C44]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onNavigate('register')}
            className="px-4 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add New Child</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E0E7DB] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-4 relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#7A8676]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search child by name, ID, or ward..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#CBD5C0] text-xs sm:text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
            />
          </div>

          {/* Mandal select filter */}
          <div className="sm:col-span-3">
            <div className="relative">
              <select
                value={mandalFilter}
                onChange={(e) => setMandalFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBD5C0] text-xs sm:text-sm text-[#1B2A18] font-semibold bg-[#F4F7F2]"
              >
                <option value="all">All Mandals ({mandals.length})</option>
                {mandals.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status select filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBD5C0] text-xs sm:text-sm text-[#1B2A18] font-semibold bg-[#F4F7F2]"
            >
              <option value="all">All Nutrition Statuses</option>
              <option value="good">Good Nutrition</option>
              <option value="needs-improvement">Needs Improvement</option>
              <option value="at-risk">At Risk (Urgent)</option>
            </select>
          </div>

          {/* Sort order toggle */}
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBD5C0] text-xs text-[#1B2A18] font-semibold bg-white"
            >
              <option value="date">Sort: Recent</option>
              <option value="name">Sort: Name</option>
              <option value="bmi">Sort: BMI</option>
              <option value="age">Sort: Age</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#7A8676] pt-1">
          <p>
            Showing <strong className="text-[#1B2A18]">{filteredAndSortedChildren.length}</strong> of{' '}
            {childrenList.length} child records
          </p>
          {(searchTerm || statusFilter !== 'all' || mandalFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setMandalFilter('all');
              }}
              className="text-xs text-[#4A7C44] font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Children Table */}
      <div className="bg-white rounded-2xl border border-[#E0E7DB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F7F2] text-[#7A8676] font-bold uppercase tracking-wider text-[10px] border-b border-[#E0E7DB]">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Mandal / Sector</th>
                <th className="py-3 px-3">Height & Weight</th>
                <th className="py-3 px-3 text-center">BMI Score</th>
                <th className="py-3 px-3">3-Pillar Intake</th>
                <th className="py-3 px-3">Nutrition Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E7DB] text-[#2D3628]">
              {filteredAndSortedChildren.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#7A8676]">
                    No student records match your search or filter parameters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedChildren.map((child) => {
                  const a = analyzeChild(child);
                  return (
                    <tr
                      key={child.id}
                      className="hover:bg-[#F4F7F2]/60 transition-colors group cursor-pointer"
                      onClick={() => onSelectChild(child.id)}
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#F0F4EF] text-[#4A7C44] font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                            {child.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1B2A18] group-hover:text-[#4A7C44] transition-colors">
                              {child.name}
                            </p>
                            <p className="text-[11px] text-[#7A8676] font-mono">{child.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#1B2A18]">{child.age} yrs</p>
                        <p className="text-[11px] text-[#7A8676] capitalize">{child.gender}</p>
                      </td>

                      {/* Mandal */}
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#1B2A18]">{child.mandalName || 'Kuppam'}</p>
                        <p className="text-[11px] text-[#7A8676] truncate max-w-[120px]">
                          {child.ward || 'Ward 1'}
                        </p>
                      </td>

                      {/* Height / Weight */}
                      <td className="py-3 px-3 font-mono">
                        <p className="text-[#1B2A18]">{child.height} cm</p>
                        <p className="text-[#7A8676]">{child.weight} kg</p>
                      </td>

                      {/* BMI */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            a.bmi < 13.0
                              ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30'
                              : a.bmi < 14.5
                              ? 'bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]'
                              : 'bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]'
                          }`}
                        >
                          {a.bmi}
                        </span>
                        <p className="text-[10px] text-[#7A8676] mt-0.5">{a.bmiCategory}</p>
                      </td>

                      {/* 3 Pillars */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              child.eggIntake >= 3
                                ? 'bg-[#F0F4EF] text-[#4A7C44]'
                                : 'bg-[#FEF2F2] text-[#DC2626]'
                            }`}
                            title="Eggs per week"
                          >
                            🥚 {child.eggIntake}/wk
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              child.milkIntake === '7 or more times'
                                ? 'bg-[#F0F4EF] text-[#4A7C44]'
                                : 'bg-[#FFF9E6] text-[#A88B45]'
                            }`}
                            title="Milk Frequency"
                          >
                            🥛 {child.milkIntake.includes('7') ? 'Daily' : child.milkIntake}
                          </span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border whitespace-nowrap ${
                            a.status === 'Good Nutrition'
                              ? 'bg-[#4A7C44]/15 text-[#4A7C44] border-[#4A7C44]/40'
                              : a.status === 'Needs Improvement'
                              ? 'bg-[#A88B45]/15 text-[#A88B45] border-[#A88B45]/40'
                              : 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/40'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectChild(child.id)}
                            className="p-1.5 text-[#7A8676] hover:text-[#4A7C44] hover:bg-[#F0F4EF] rounded-lg transition-colors"
                            title="View Student Dossier"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              onSelectChildForFood(child.id);
                              onNavigate('food-suggestions');
                            }}
                            className="p-1.5 text-[#7A8676] hover:text-[#A88B45] hover:bg-[#FFF9E6] rounded-lg transition-colors"
                            title="View Tailored Food Menu"
                          >
                            <Utensils className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => onEditChild(child)}
                            className="p-1.5 text-[#7A8676] hover:text-[#1B2A18] hover:bg-[#F4F7F2] rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete record for ${child.name}?`)) {
                                onDeleteChild(child.id);
                              }
                            }}
                            className="p-1.5 text-[#7A8676] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                            title="Delete Record"
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
    </div>
  );
};
