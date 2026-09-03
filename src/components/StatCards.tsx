import React from 'react';
import { motion } from 'motion/react';
import { Users, Heart, AlertCircle, ShieldAlert, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { VillageStats, NutritionStatus } from '../types';

interface StatCardsProps {
  stats: VillageStats;
  selectedFilter: NutritionStatus | 'All';
  onSelectFilter: (filter: NutritionStatus | 'All') => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  stats,
  selectedFilter,
  onSelectFilter,
}) => {
  const goodPct = stats.totalChildren > 0 ? Math.round((stats.goodCount / stats.totalChildren) * 100) : 0;
  const impPct = stats.totalChildren > 0 ? Math.round((stats.improvementCount / stats.totalChildren) * 100) : 0;
  const riskPct = stats.totalChildren > 0 ? Math.round((stats.atRiskCount / stats.totalChildren) * 100) : 0;

  const cards = [
    {
      id: 'stat-card-total',
      filter: 'All' as const,
      title: 'Total Enrolled',
      count: stats.totalChildren,
      subtitle: 'Village school & anganwadi',
      submetric: `Avg BMI: ${stats.avgBmi} • Avg Eggs: ${stats.avgEggs}/wk`,
      icon: Users,
      badge: 'All Students',
      activeBorder: 'ring-2 ring-[#1B2A18] border-[#1B2A18]',
      barColor: 'bg-[#1B2A18]',
      percent: 100,
      iconBg: 'bg-[#F0F4EF] text-[#1B2A18] border border-[#CBD5C0]',
      badgeBg: 'bg-[#F0F4EF] text-[#1B2A18] border border-[#CBD5C0]',
    },
    {
      id: 'stat-card-good',
      filter: 'Good Nutrition' as const,
      title: 'Good Nutrition',
      count: stats.goodCount,
      subtitle: 'Optimal weekly eggs, milk & veggies',
      submetric: `${goodPct}% of total cohort meets guidelines`,
      icon: Heart,
      badge: 'Target Met',
      activeBorder: 'ring-2 ring-[#4A7C44] border-[#4A7C44]',
      barColor: 'bg-[#4A7C44]',
      percent: goodPct,
      iconBg: 'bg-[#E6F4E6] text-[#4A7C44] border border-[#C6E0C6]',
      badgeBg: 'bg-[#E6F4E6] text-[#4A7C44] border border-[#C6E0C6]',
    },
    {
      id: 'stat-card-improvement',
      filter: 'Needs Improvement' as const,
      title: 'Needs Improvement',
      count: stats.improvementCount,
      subtitle: '1-2 nutritional warning flags',
      submetric: `${impPct}% lacking regular milk or eggs`,
      icon: AlertCircle,
      badge: 'Moderate Deficit',
      activeBorder: 'ring-2 ring-[#A88B45] border-[#A88B45]',
      barColor: 'bg-[#A88B45]',
      percent: impPct,
      iconBg: 'bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]',
      badgeBg: 'bg-[#FFF9E6] text-[#A88B45] border border-[#F3E5AB]',
    },
    {
      id: 'stat-card-risk',
      filter: 'At Risk' as const,
      title: 'At Risk',
      count: stats.atRiskCount,
      subtitle: '3+ severe malnutrition indicators',
      submetric: `Urgent care (${stats.atRiskGirls} girls, ${stats.atRiskBoys} boys)`,
      icon: ShieldAlert,
      badge: 'Urgent Care',
      activeBorder: 'ring-2 ring-[#DC2626] border-[#DC2626]',
      barColor: 'bg-[#DC2626]',
      percent: riskPct,
      iconBg: 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]',
      badgeBg: 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.filter;

        return (
          <motion.div
            key={card.id}
            id={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            onClick={() => onSelectFilter(card.filter)}
            className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
              isSelected
                ? `${card.activeBorder} shadow-sm bg-white`
                : 'border-[#E0E7DB] hover:border-[#CBD5C0]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} transition-transform group-hover:scale-105`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${card.badgeBg}`}>
                  {card.badge}
                </span>
                <ArrowUpRight
                  className={`h-4 w-4 text-[#7A8676] opacity-0 group-hover:opacity-100 transition-opacity ${
                    isSelected ? 'opacity-100 text-[#1B2A18]' : ''
                  }`}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#1B2A18] tracking-tight">
                  {card.count}
                </span>
                <span className="text-xs text-[#7A8676] font-semibold">
                  ({card.percent}%)
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#1B2A18] mt-1">
                {card.title}
              </h3>
              <p className="text-xs text-[#7A8676] mt-0.5">
                {card.subtitle}
              </p>
            </div>

            {/* Progress indicator bar */}
            <div className="mt-4 pt-3 border-t border-[#E0E7DB]">
              <div className="w-full bg-[#F0F4EF] rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${card.barColor}`}
                  style={{ width: `${card.percent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#7A8676] mt-2 font-medium flex items-center justify-between">
                <span>{card.submetric}</span>
                {isSelected && (
                  <span className="text-[#1B2A18] font-bold flex items-center gap-0.5 text-[10px] uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3 text-[#4A7C44] inline" /> Active
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
