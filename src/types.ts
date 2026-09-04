export type Gender = 'male' | 'female';

export type MilkIntake = '1-2 times' | '3-4 times' | '5-6 times' | '7 or more times';

export type VegetableIntake = '3-4 times a week' | '1-2 times a week' | 'rarely';

export type NutritionStatus = 'Good Nutrition' | 'Needs Improvement' | 'At Risk';

export interface Mandal {
  id: string;
  name: string;
  district: string;
  supervisorName: string;
  supervisorPhone: string;
  anganwadiCount: number;
  enrolledChildrenCount?: number;
  notes?: string;
}

export interface ChildRecord {
  id: string;
  name: string;
  age: number; // 1 - 18
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  eggIntake: number; // eggs per week
  milkIntake: MilkIntake;
  vegetableIntake: VegetableIntake;
  mandalId: string;
  mandalName?: string;
  ward?: string;
  schoolGrade?: string;
  guardianContact?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NutritionAnalysis {
  bmi: number;
  bmiCategory: 'Severely Underweight' | 'Underweight' | 'Normal' | 'Overweight';
  warningCount: number;
  warnings: string[];
  recommendations: string[];
  status: NutritionStatus;
  eggDeficit: boolean;
  vegetableDeficit: boolean;
  milkDeficit: boolean;
  bmiDeficit: boolean;
}

export interface VillageStats {
  totalChildren: number;
  goodCount: number;
  improvementCount: number;
  atRiskCount: number;
  avgEggs: number;
  avgBmi: number;
  milkOptimalPercent: number;
  vegetableOptimalPercent: number;
  atRiskGirls: number;
  atRiskBoys: number;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'supervisor' | 'medical_officer' | 'viewer';
  mandalJurisdiction?: string;
  token?: string;
}

export interface FoodSuggestionItem {
  id: string;
  name: string;
  localName?: string;
  category: 'protein' | 'calcium' | 'iron_vitamins' | 'energy_dense' | 'balanced_meal';
  targetDeficit: 'egg' | 'milk' | 'vegetable' | 'bmi' | 'general';
  imageUrl: string;
  nutritionHighlights: string[];
  calories: string;
  protein: string;
  recommendedServing: string;
  cookingGuideline: string;
  anganwadiMealTip: string;
}

export type ActivePage =
  | 'dashboard'
  | 'records'
  | 'child-details'
  | 'register'
  | 'bmi-score'
  | 'food-suggestions'
  | 'mandals'
  | 'admin-login';

export type FilterStatus = 'all' | 'good' | 'needs-improvement' | 'at-risk';
