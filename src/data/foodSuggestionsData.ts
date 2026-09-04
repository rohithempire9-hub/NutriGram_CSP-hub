import { FoodSuggestionItem } from '../types';

export const NUTRITION_FOOD_ITEMS: FoodSuggestionItem[] = [
  {
    id: 'food-egg-boiled',
    name: 'Hard-Boiled Farm Eggs',
    localName: 'Urakodi Guddu / Boiled Egg',
    category: 'protein',
    targetDeficit: 'egg',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      '6.3g Complete Bioavailable Protein',
      '147mg Choline for Brain Development',
      'Vitamin B12 & Lutein for Eye Health',
    ],
    calories: '78 kcal per egg',
    protein: '6.3 g',
    recommendedServing: '1-2 boiled eggs per day (minimum 4-5 per week)',
    cookingGuideline:
      'Boil for 9-10 minutes in clean salted water. Serve warm sprinkled with light roasted cumin and black pepper powder to enhance zinc absorption.',
    anganwadiMealTip:
      'Distribute during Mid-Day meal morning snack time. Ensure peer-encouraged group dining.',
  },
  {
    id: 'food-egg-curry',
    name: 'Tomato & Onion Egg Curry',
    localName: 'Kodi Guddu Pulusu / Egg Curry',
    category: 'protein',
    targetDeficit: 'egg',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      '12g Protein per serving (2 eggs)',
      'Lycopene from cooked ripe tomatoes',
      'Vitamin A & healthy fats for absorption',
    ],
    calories: '160 kcal per bowl',
    protein: '12.0 g',
    recommendedServing: '1 serving with brown or parboiled rice / millets',
    cookingGuideline:
      'Lightly roast boiled eggs in turmeric and a teaspoon of cold-pressed mustard or groundnut oil, simmer in freshly crushed tomato and coriander gravy.',
    anganwadiMealTip:
      'Ideal for Wednesday and Friday hot-cooked school lunch to ensure maximum attendance.',
  },
  {
    id: 'food-fortified-milk',
    name: 'Warm Fortified Milk with Cardamom',
    localName: 'Aavu Paalu / Fortified Cow Milk',
    category: 'calcium',
    targetDeficit: 'milk',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      '240mg Calcium for Bone & Teeth Mineralization',
      'Fortified Vitamin A & Vitamin D',
      '8g Casein & Whey High-Quality Protein',
    ],
    calories: '120 kcal per 200ml cup',
    protein: '7.8 g',
    recommendedServing: '200ml glass daily in the morning',
    cookingGuideline:
      'Boil milk thoroughly with a pinch of green cardamom or dried turmeric powder (haldi). Do not over-sweeten; use jaggery powder if required.',
    anganwadiMealTip:
      'Serve at 9:30 AM during morning assembly circle to boost cognitive alertness.',
  },
  {
    id: 'food-curd-chaas',
    name: 'Fresh Village Curd & Spiced Buttermilk',
    localName: 'Perugu & Majjiga / Buttermilk',
    category: 'calcium',
    targetDeficit: 'milk',
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      'Live Probiotics for Gut Microbiome & Digestion',
      '180mg Bioavailable Calcium',
      'Hydration & essential electrolytes',
    ],
    calories: '90 kcal per glass',
    protein: '4.5 g',
    recommendedServing: '1 cup fresh curd or 1 large glass buttermilk after lunch',
    cookingGuideline:
      'Churn fresh set curd with cool water, add crushed curry leaves, roasted cumin, and ginger juice for appetite stimulation.',
    anganwadiMealTip:
      'Excellent for children with mild lactose discomfort or digestive sluggishness.',
  },
  {
    id: 'food-moringa-leaves',
    name: 'Drumstick Leaf (Moringa) Dal',
    localName: 'Munagaku Pappu / Moringa Dal',
    category: 'iron_vitamins',
    targetDeficit: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      'Rich in Non-Heme Iron (reverses childhood anemia)',
      '4x Vitamin A of Carrots for Night Vision',
      'Potent Flavonoids & Vitamin C',
    ],
    calories: '135 kcal per cup',
    protein: '7.2 g',
    recommendedServing: '1 cup with steamed rice or ragi roti at lunch',
    cookingGuideline:
      'Wash fresh moringa leaves thoroughly. Cook with toor dal (split pigeon peas) and a splash of lemon juice to quadruple iron bioavailability.',
    anganwadiMealTip:
      'Harvest directly from the school’s Poshan Vatika nutrition garden zero-cost supply.',
  },
  {
    id: 'food-palak-paneer',
    name: 'Spinach & Vegetable Dal Khichdi',
    localName: 'Palakura Kichidi / Spinach Khichdi',
    category: 'iron_vitamins',
    targetDeficit: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      'Folate for Rapid Cellular Growth',
      'Dietary Fiber for Healthy Elimination',
      'Beta-Carotene & Vitamin K',
    ],
    calories: '175 kcal per bowl',
    protein: '6.5 g',
    recommendedServing: '1 large bowl (150-200g)',
    cookingGuideline:
      'Blanch spinach lightly and blend with tomatoes and lentils. Simmer with cumin, ghee, and mild turmeric seasoning.',
    anganwadiMealTip:
      'Mix finely chopped greens into the daily dal to prevent children from picking leaves out.',
  },
  {
    id: 'food-ragi-porridge',
    name: 'Sprouted Ragi (Finger Millet) Malt',
    localName: 'Ragi Jawa / Ragi Malt',
    category: 'energy_dense',
    targetDeficit: 'bmi',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      '344mg Calcium per 100g (Highest of all cereals)',
      'Slow-release Complex Carbohydrates',
      'Essential Amino Acids (Methionine & Lysine)',
    ],
    calories: '180 kcal per bowl',
    protein: '5.2 g',
    recommendedServing: '1 cup warm porridge as morning mid-meal snack',
    cookingGuideline:
      'Whisk sprouted ragi flour with water, boil until glossy, blend in warm milk or buttermilk with a spoon of jaggery.',
    anganwadiMealTip:
      'Proven traditional growth enhancer for underweight and stunting recovery.',
  },
  {
    id: 'food-peanut-chikki',
    name: 'Peanut & Jaggery Chikki / Laddu',
    localName: 'Palli Patti / Peanut Jaggery Laddu',
    category: 'energy_dense',
    targetDeficit: 'bmi',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      'High Calorie Density for Rapid Weight Catch-Up',
      'Heart-healthy Monounsaturated Fats',
      'Iron from Organic Mineral-Rich Jaggery',
    ],
    calories: '155 kcal per piece (30g)',
    protein: '5.0 g',
    recommendedServing: '1 laddu/chikki daily after meal or as take-home ration',
    cookingGuideline:
      'Dry roast groundnuts until fragrant, mix into molten jaggery syrup (soft ball consistency), shape into bite-sized balls or squares.',
    anganwadiMealTip:
      'Prescribed as supplemental therapeutic nutrition for children with BMI < 14.',
  },
  {
    id: 'food-poshan-khichdi',
    name: 'Multi-Grain Poshan Khichdi with Mixed Veggies',
    localName: 'Samrudha Khichdi / Nutrition Stew',
    category: 'balanced_meal',
    targetDeficit: 'general',
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    nutritionHighlights: [
      'Complementary Cereals & Pulses (Complete Protein)',
      'Rich in Carrots, Green Beans, and Peas',
      'Fortified with 1 teaspoon Desi Cow Ghee',
    ],
    calories: '260 kcal per bowl',
    protein: '9.5 g',
    recommendedServing: '1 generous bowl as warm midday meal',
    cookingGuideline:
      'Pressure cook rice and moong dal in 2:1 ratio with grated seasonal vegetables, tempered with cumin, curry leaves, and asafoetida.',
    anganwadiMealTip:
      'Baseline standard meal providing 45% of daily recommended caloric and protein intake.',
  },
];
