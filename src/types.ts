export type Gender = 'male' | 'female';

export type MilkIntake = '1-2 times' | '3-4 times' | '5-6 times' | '7 or more times';

export type VegetableIntake = '3-4 times a week' | '1-2 times a week' | 'rarely';

export type NutritionStatus = 'Good Nutrition' | 'Needs Improvement' | 'At Risk';

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
