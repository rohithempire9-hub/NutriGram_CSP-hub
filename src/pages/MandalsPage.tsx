import React, { useState } from 'react';
import { Mandal, ChildRecord, AuthUser } from '../types';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Phone,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Search,
} from 'lucide-react';

interface MandalsPageProps {
  mandals: Mandal[];
  childrenList: ChildRecord[];
  currentUser: AuthUser | null;
  onSaveMandal: (mandal: Mandal) => void;
  onDeleteMandal: (id: string) => void;
  onSelectMandalForFilter: (mandalName: string) => void;
  onNavigate: (page: string) => void;
}

export const MandalsPage: React.FC<MandalsPageProps> = ({
  mandals,
  childrenList,
  currentUser,
  onSaveMandal,
  onDeleteMandal,
  onSelectMandalForFilter,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMandal, setEditingMandal] = useState<Mandal | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Chittoor District');
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorPhone, setSupervisorPhone] = useState('+91 ');
  const [anganwadiCount, setAnganwadiCount] = useState<number>(20);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingMandal(null);
    setName('');
    setDistrict('Chittoor District');
    setSupervisorName('');
    setSupervisorPhone('+91 ');
    setAnganwadiCount(15);
    setNotes('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (m: Mandal) => {
    setEditingMandal(m);
    setName(m.name);
    setDistrict(m.district);
    setSupervisorName(m.supervisorName);
    setSupervisorPhone(m.supervisorPhone);
    setAnganwadiCount(m.anganwadiCount);
    setNotes(m.notes || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter a Mandal name');
      return;
    }

    if (!supervisorName.trim()) {
      setFormError('Please enter the assigned supervisor name');
      return;
    }

    const mandalObj: Mandal = {
      id: editingMandal ? editingMandal.id : `mandal-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      district: district.trim() || 'Chittoor District',
      supervisorName: supervisorName.trim(),
      supervisorPhone: supervisorPhone.trim() || '+91 98450 00000',
      anganwadiCount: Number(anganwadiCount) || 10,
      notes: notes.trim(),
    };

    onSaveMandal(mandalObj);
    setIsModalOpen(false);
  };

  const filteredMandals = mandals.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supervisorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAnganwadis = mandals.reduce((sum, m) => sum + m.anganwadiCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
              Administrative Jurisdiction
            </span>
            <span className="text-xs text-[#7A8676]">Dynamic Storage Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2A18] mt-1">
            Mandals & Sector Management
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8676] mt-1 max-w-2xl">
            Store and organize rural Mandals, Anganwadi clusters, and supervisor jurisdictions. All records and children dynamically link to these mandals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add New Mandal</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E0E7DB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">
              Registered Mandals
            </span>
            <Building2 className="h-5 w-5 text-[#4A7C44]" />
          </div>
          <p className="text-3xl font-black text-[#1B2A18] mt-2 font-mono">{mandals.length}</p>
          <p className="text-xs text-[#7A8676] mt-1">Sub-district administrative blocks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0E7DB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">
              Total Anganwadis
            </span>
            <MapPin className="h-5 w-5 text-[#A88B45]" />
          </div>
          <p className="text-3xl font-black text-[#1B2A18] mt-2 font-mono">{totalAnganwadis}</p>
          <p className="text-xs text-[#7A8676] mt-1">Nutrition & feeding centers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0E7DB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676]">
              Children Enrolled
            </span>
            <Users className="h-5 w-5 text-[#3B82F6]" />
          </div>
          <p className="text-3xl font-black text-[#1B2A18] mt-2 font-mono">{childrenList.length}</p>
          <p className="text-xs text-[#7A8676] mt-1">Tracked across all sectors</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E7DB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#7A8676]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Mandal, district, or supervisor..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#CBD5C0] text-xs sm:text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
          />
        </div>
        <p className="text-xs font-semibold text-[#7A8676]">
          Showing {filteredMandals.length} of {mandals.length} stored Mandals
        </p>
      </div>

      {/* Mandal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMandals.map((mandal) => {
          const childrenInMandal = childrenList.filter(
            (c) => c.mandalId === mandal.id || c.mandalName === mandal.name
          );
          const atRiskInMandal = childrenInMandal.filter(
            (c) => (c.eggIntake <= 1 && c.vegetableIntake === 'rarely') || c.weight / ((c.height / 100) * (c.height / 100)) < 14
          ).length;

          return (
            <div
              key={mandal.id}
              className="bg-white rounded-2xl p-6 border border-[#E0E7DB] shadow-xs hover:border-[#CBD5C0] transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1B2A18]">{mandal.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F0F4EF] text-[#4A7C44] border border-[#CBD5C0]">
                      {mandal.district}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A8676] mt-0.5">{mandal.notes || 'Gram Panchayat Sector'}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(mandal)}
                    className="p-1.5 text-[#7A8676] hover:text-[#4A7C44] hover:bg-[#F0F4EF] rounded-lg transition-colors"
                    title="Edit Mandal Details"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${mandal.name}? Any linked children will need to be reassigned.`)) {
                        onDeleteMandal(mandal.id);
                      }
                    }}
                    className="p-1.5 text-[#7A8676] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                    title="Delete Mandal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F4F7F2] border border-[#E0E7DB] text-center">
                <div>
                  <p className="text-xs font-bold text-[#1B2A18] font-mono">{mandal.anganwadiCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] mt-0.5">Anganwadis</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#4A7C44] font-mono">{childrenInMandal.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] mt-0.5">Enrolled</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A88B45] font-mono">{atRiskInMandal}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8676] mt-0.5">High Deficit</p>
                </div>
              </div>

              {/* Supervisor Details */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E0E7DB]">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-[#4A7C44]" />
                  <span className="font-semibold text-[#1B2A18]">{mandal.supervisorName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7A8676]">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="font-mono text-[11px]">{mandal.supervisorPhone}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectMandalForFilter(mandal.name);
                    onNavigate('records');
                  }}
                  className="w-full py-2 rounded-xl bg-[#F0F4EF] hover:bg-[#E0E7DB] text-[#1B2A18] font-bold text-xs border border-[#CBD5C0] transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-[#4A7C44]" />
                  <span>View {childrenInMandal.length} Child Records</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#E0E7DB] shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E7DB]">
              <h3 className="text-lg font-bold text-[#1B2A18]">
                {editingMandal ? 'Edit Mandal Information' : 'Register New Mandal'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#7A8676] hover:text-[#1B2A18] rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                  Mandal Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kuppam Mandal or V. Kota Mandal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Chittoor District"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                    Anganwadis Count
                  </label>
                  <input
                    type="number"
                    value={anganwadiCount}
                    onChange={(e) => setAnganwadiCount(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                  Assigned Supervisor *
                </label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  placeholder="e.g. Smt. Lakshmi Devi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                  Supervisor Contact Phone
                </label>
                <input
                  type="text"
                  value={supervisorPhone}
                  onChange={(e) => setSupervisorPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2A18] mb-1 uppercase tracking-wider">
                  Notes / Local Context
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special school feeding drives, community gardens, or priority habitations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C0] text-sm text-[#1B2A18] focus:border-[#4A7C44] focus:ring-1 focus:ring-[#4A7C44]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E0E7DB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8676] hover:bg-[#F4F7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4A7C44] hover:bg-[#3e6839] text-white font-bold text-xs shadow-xs"
                >
                  {editingMandal ? 'Update Mandal' : 'Save Mandal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
