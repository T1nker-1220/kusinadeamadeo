'use client';

import TrendChart, { ChartMetric } from './TrendChart';

interface OverviewRevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  height?: number;
  compact?: boolean;
}

const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;
const formatNumber = (value: number) => value.toLocaleString();

export default function OverviewRevenueChart({ 
  data, 
  height = 250, 
  compact = true 
}: OverviewRevenueChartProps) {
  const metrics: ChartMetric[] = [
    {
      key: 'revenue',
      name: 'Revenue',
      color: '#f97316', // orange-500
      type: 'bar',
      yAxisId: 'left',
      format: formatCurrency
    },
    {
      key: 'orders',
      name: 'Orders',
      color: '#06b6d4', // cyan-500
      type: 'line',
      yAxisId: 'right',
      format: formatNumber
    }
  ];

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <h3 className="text-lg font-bold mb-3 text-foreground">Daily Revenue & Orders Trend</h3>
      <TrendChart
        data={data}
        metrics={metrics}
        chartType="composed"
        height={height}
        showGrid={true}
        showLegend={true}
        compact={compact}
      />
    </div>
  );
} 