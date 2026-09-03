import { ChildRecord, NutritionAnalysis, NutritionStatus, VillageStats } from '../types';

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightInMeters = heightCm / 100;
  const bmi = weightKg / (heightInMeters * heightInMeters);
  return Number(bmi.toFixed(2));
}

export function getBMICategory(bmi: number, age: number): 'Severely Underweight' | 'Underweight' | 'Normal' | 'Overweight' {
  // WHO/IAP pediatric BMI reference approximations for ages 3-14
  if (bmi < 13.0) return 'Severely Underweight';
  if (bmi < 14.5) return 'Underweight';
  if (bmi <= 18.5) return 'Normal';
  return 'Overweight';
}

export function analyzeChild(child: Omit<ChildRecord, 'id' | 'createdAt'>): NutritionAnalysis {
  const bmi = calculateBMI(child.height, child.weight);
  const bmiCat = getBMICategory(bmi, child.age);

  const eggDeficit = child.eggIntake < 3;
  const vegetableDeficit = child.vegetableIntake === 'rarely' || child.vegetableIntake === '1-2 times a week';
  const milkDeficit = child.milkIntake === '1-2 times' || child.milkIntake === '3-4 times';
  const bmiDeficit = bmi < 14;

  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (eggDeficit) {
    warnings.push(`Low egg intake (${child.eggIntake}/week): Deficit in essential protein & choline`);
    recommendations.push(`Target 4-6 boiled eggs per week via Anganwadi/Midday meal`);
  }

  if (milkDeficit) {
    warnings.push(`Inadequate milk consumption (${child.milkIntake}): Calcium & Vitamin D deficiency risk`);
    recommendations.push(`Provide 200ml fortified milk daily at morning assembly or snack time`);
  }

  if (vegetableDeficit) {
    warnings.push(`Low vegetable intake (${child.vegetableIntake}): Micronutrient & dietary fiber deficit`);
    recommendations.push(`Incorporate locally grown moringa leaves, carrots, spinach & lentils`);
  }

  if (bmiDeficit) {
    warnings.push(`Low BMI (${bmi}): Child exhibits severe acute malnutrition or wasting signs`);
    recommendations.push(`Refer to PHC / Anganwadi Supervisor for targeted nutritional supplementation`);
  }

  const warningCount = warnings.length;
  let status: NutritionStatus = 'Good Nutrition';

  if (warningCount === 0) {
    status = 'Good Nutrition';
    if (recommendations.length === 0) {
      recommendations.push('Maintain balanced diet with eggs, dairy, pulses, and diverse vegetables');
    }
  } else if (warningCount <= 2) {
    status = 'Needs Improvement';
  } else {
    status = 'At Risk';
  }

  return {
    bmi,
    bmiCategory: bmiCat,
    warningCount,
    warnings,
    recommendations,
    status,
    eggDeficit,
    vegetableDeficit,
    milkDeficit,
    bmiDeficit,
  };
}

export function calculateVillageStats(children: ChildRecord[]): VillageStats {
  if (children.length === 0) {
    return {
      totalChildren: 0,
      goodCount: 0,
      improvementCount: 0,
      atRiskCount: 0,
      avgEggs: 0,
      avgBmi: 0,
      milkOptimalPercent: 0,
      vegetableOptimalPercent: 0,
      atRiskGirls: 0,
      atRiskBoys: 0,
    };
  }

  let goodCount = 0;
  let improvementCount = 0;
  let atRiskCount = 0;
  let totalEggs = 0;
  let totalBmi = 0;
  let milkOptimalCount = 0;
  let vegOptimalCount = 0;
  let atRiskGirls = 0;
  let atRiskBoys = 0;

  children.forEach((child) => {
    const analysis = analyzeChild(child);
    totalEggs += child.eggIntake;
    totalBmi += analysis.bmi;

    if (analysis.status === 'Good Nutrition') goodCount++;
    else if (analysis.status === 'Needs Improvement') improvementCount++;
    else {
      atRiskCount++;
      if (child.gender === 'female') atRiskGirls++;
      else atRiskBoys++;
    }

    if (child.milkIntake === '5-6 times' || child.milkIntake === '7 or more times') {
      milkOptimalCount++;
    }
    if (child.vegetableIntake === '3-4 times a week') {
      vegOptimalCount++;
    }
  });

  return {
    totalChildren: children.length,
    goodCount,
    improvementCount,
    atRiskCount,
    avgEggs: Number((totalEggs / children.length).toFixed(1)),
    avgBmi: Number((totalBmi / children.length).toFixed(1)),
    milkOptimalPercent: Math.round((milkOptimalCount / children.length) * 100),
    vegetableOptimalPercent: Math.round((vegOptimalCount / children.length) * 100),
    atRiskGirls,
    atRiskBoys,
  };
}
