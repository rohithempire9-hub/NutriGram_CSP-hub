import React, { useState, useEffect } from 'react';
import {
  ActivePage,
  ChildRecord,
  Mandal,
  AuthUser,
  NutritionStatus,
} from './types';
import { INITIAL_CHILDREN } from './data/initialData';
import { INITIAL_MANDALS } from './data/mandalData';
import { Navbar } from './components/Navbar';
import { ChildModal } from './components/ChildModal';
import { PresentationMode } from './components/PresentationMode';

// Multi-Page Views
import { DashboardPage } from './pages/DashboardPage';
import { ChildRecordsPage } from './pages/ChildRecordsPage';
import { ChildDetailPage } from './pages/ChildDetailPage';
import { AddChildPage } from './pages/AddChildPage';
import { BmiScorePage } from './pages/BmiScorePage';
import { FoodSuggestionsPage } from './pages/FoodSuggestionsPage';
import { MandalsPage } from './pages/MandalsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { calculateVillageStats, analyzeChild } from './utils/nutritionCalculations';

const LOCAL_STORAGE_KEY_CHILDREN = 'nutrigram_children_v1';
const LOCAL_STORAGE_KEY_MANDALS = 'nutrigram_mandals_v1';
const LOCAL_STORAGE_KEY_AUTH = 'nutrigram_auth_v1';

export default function App() {
  // Page Navigation State
  const [activePage, setActivePage] = useState<ActivePage>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      const validPages: ActivePage[] = [
        'dashboard',
        'records',
        'child-details',
        'register',
        'bmi-score',
        'food-suggestions',
        'mandals',
        'admin-login',
      ];
      if (validPages.includes(hash as ActivePage)) {
        return hash as ActivePage;
      }
    } catch (e) {
      console.error('Error reading hash:', e);
    }
    return 'dashboard';
  });

  // Children State (Persistent via LocalStorage)
  const [children, setChildren] = useState<ChildRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CHILDREN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved children records:', e);
    }
    return INITIAL_CHILDREN;
  });

  // Mandals State (Persistent via LocalStorage)
  const [mandals, setMandals] = useState<Mandal[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MANDALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved mandals:', e);
    }
    return INITIAL_MANDALS;
  });

  // Auth User State (Persistent via LocalStorage)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading auth user:', e);
    }
    // Default demo supervisor
    return {
      id: 'usr-sup-01',
      username: 'supervisor.lakshmi',
      name: 'Smt. Lakshmi Devi (Supervisor)',
      role: 'supervisor',
      mandalJurisdiction: 'Kuppam Mandal',
      token: 'jwt-auth-session-valid',
    };
  });

  // Auxiliary View States
  const [selectedChildId, setSelectedChildId] = useState<string>(INITIAL_CHILDREN[0]?.id || 'ch-01');
  const [initialMandalFilterForRecords, setInitialMandalFilterForRecords] = useState<string>('all');
  const [childToEdit, setChildToEdit] = useState<ChildRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);

  // Sync activePage to URL Hash
  const navigateTo = (page: ActivePage | string) => {
    const targetPage = page as ActivePage;
    setActivePage(targetPage);
    window.location.hash = targetPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages: ActivePage[] = [
        'dashboard',
        'records',
        'child-details',
        'register',
        'bmi-score',
        'food-suggestions',
        'mandals',
        'admin-login',
      ];
      if (validPages.includes(hash as ActivePage)) {
        setActivePage(hash as ActivePage);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Persist Children
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHILDREN, JSON.stringify(children));
    } catch (e) {
      console.error('Error saving children:', e);
    }
  }, [children]);

  // Persist Mandals
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MANDALS, JSON.stringify(mandals));
    } catch (e) {
      console.error('Error saving mandals:', e);
    }
  }, [mandals]);

  // Persist Auth
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY_AUTH, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.error('Error saving auth:', e);
    }
  }, [currentUser]);

  // Handler: Save or update child
  const handleSaveChild = (
    childData: Omit<ChildRecord, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setChildren((prev) =>
        prev.map((c) =>
          c.id === existingId
            ? {
                ...c,
                ...childData,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } else {
      const newChild: ChildRecord = {
        ...childData,
        id: `ch-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      setChildren((prev) => [newChild, ...prev]);
      setSelectedChildId(newChild.id);
    }
  };

  // Handler: Delete child
  const handleDeleteChild = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
    if (selectedChildId === id) {
      const remaining = children.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setSelectedChildId(remaining[0].id);
      }
    }
  };

  // Handler: Save Mandal
  const handleSaveMandal = (mandal: Mandal) => {
    setMandals((prev) => {
      const exists = prev.some((m) => m.id === mandal.id);
      if (exists) {
        return prev.map((m) => (m.id === mandal.id ? mandal : m));
      }
      return [...prev, mandal];
    });
  };

  // Handler: Delete Mandal
  const handleDeleteMandal = (id: string) => {
    setMandals((prev) => prev.filter((m) => m.id !== id));
  };

  // Handler: Auth Login / Logout
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handler: Select child for detail or food suggestions
  const handleSelectChild = (id: string) => {
    setSelectedChildId(id);
    navigateTo('child-details');
  };

  const handleSelectChildForFood = (id: string) => {
    setSelectedChildId(id);
    navigateTo('food-suggestions');
  };

  const handleEditChild = (child: ChildRecord) => {
    setChildToEdit(child);
    setIsEditModalOpen(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Child ID',
      'Name',
      'Age',
      'Gender',
      'Height (cm)',
      'Weight (kg)',
      'BMI',
      'BMI Category',
      'Eggs Per Week',
      'Milk Intake',
      'Vegetable Intake',
      'Mandal',
      'Ward',
      'Nutritional Status',
    ];

    const rows = children.map((c) => {
      const a = analyzeChild(c);
      return [
        `"${c.id}"`,
        `"${c.name}"`,
        c.age,
        `"${c.gender}"`,
        c.height,
        c.weight,
        a.bmi,
        `"${a.bmiCategory}"`,
        c.eggIntake,
        `"${c.milkIntake}"`,
        `"${c.vegetableIntake}"`,
        `"${c.mandalName || 'Mandal'}"`,
        `"${c.ward || ''}"`,
        `"${a.status}"`,
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `nutrigram_records_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active child object for child-details
  const activeChild = children.find((c) => c.id === selectedChildId) || children[0] || null;
  const stats = calculateVillageStats(children);

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#2D3628] flex flex-col font-sans">
      {/* Dynamic Multi-Page Header & Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onOpenPresentation={() => setShowPresentation(true)}
        onExportData={handleExportCSV}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activePage === 'dashboard' && (
          <DashboardPage
            childrenList={children}
            mandals={mandals}
            onNavigate={navigateTo}
            onSelectChildForFood={handleSelectChildForFood}
          />
        )}

        {activePage === 'records' && (
          <ChildRecordsPage
            childrenList={children}
            mandals={mandals}
            initialMandalFilter={initialMandalFilterForRecords}
            onSelectChild={handleSelectChild}
            onEditChild={handleEditChild}
            onDeleteChild={handleDeleteChild}
            onNavigate={navigateTo}
            onSelectChildForFood={handleSelectChildForFood}
          />
        )}

        {activePage === 'child-details' && (
          <ChildDetailPage
            child={activeChild}
            onBack={() => navigateTo('records')}
            onEdit={handleEditChild}
            onViewFoodSuggestions={handleSelectChildForFood}
          />
        )}

        {activePage === 'register' && (
          <AddChildPage
            mandals={mandals}
            onSaveChild={(newChild) => handleSaveChild(newChild)}
            onNavigate={navigateTo}
            onSelectChildForFood={handleSelectChildForFood}
          />
        )}

        {activePage === 'bmi-score' && (
          <BmiScorePage
            childrenList={children}
            mandals={mandals}
            onSelectChildForFood={handleSelectChildForFood}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'food-suggestions' && (
          <FoodSuggestionsPage
            childrenList={children}
            selectedChildId={selectedChildId}
            onSelectChild={(id) => setSelectedChildId(id)}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'mandals' && (
          <MandalsPage
            mandals={mandals}
            childrenList={children}
            currentUser={currentUser}
            onSaveMandal={handleSaveMandal}
            onDeleteMandal={handleDeleteMandal}
            onSelectMandalForFilter={(mandalName) => {
              setInitialMandalFilterForRecords(mandalName);
            }}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'admin-login' && (
          <AdminLoginPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1B2A18] text-white mt-12 py-6 border-t border-[#2D3628] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4A7C44]" />
            <span>NutriGram Rural Poshan Abhiyan • Dynamic System Active</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#CBD5C0] text-xs">
            <button
              onClick={() => navigateTo('records')}
              className="hover:text-white transition-colors"
            >
              Child Records ({children.length})
            </button>
            <button
              onClick={() => navigateTo('bmi-score')}
              className="hover:text-white transition-colors"
            >
              BMI Growth Metric
            </button>
            <button
              onClick={() => navigateTo('food-suggestions')}
              className="hover:text-white transition-colors"
            >
              Food Suggestions
            </button>
            <button
              onClick={() => navigateTo('mandals')}
              className="hover:text-white transition-colors"
            >
              Mandals ({mandals.length})
            </button>
            <button
              onClick={() => navigateTo('admin-login')}
              className="hover:text-white transition-colors"
            >
              {currentUser ? 'Admin Active' : 'Admin Login'}
            </button>
          </div>
        </div>
      </footer>

      {/* Edit Child Modal (Callable from records or child-detail) */}
      <ChildModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setChildToEdit(null);
        }}
        onSave={handleSaveChild}
        childToEdit={childToEdit}
        mandals={mandals}
      />

      {/* Presentation Mode Fullscreen Overlay */}
      {showPresentation && (
        <PresentationMode
          childrenList={children}
          stats={stats}
          onClose={() => setShowPresentation(false)}
        />
      )}
    </div>
  );
}
