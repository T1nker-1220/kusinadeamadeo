'use client';

import { useState } from 'react';
import TrendChart, { ChartMetric } from './TrendChart';
import { Eye, EyeOff } from 'lucide-react';

interface AnalyticsTrendChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
    completedOrders: number;
    avgOrderValue?: number;
  }>;
  height?: number;
  compact?: boolean;
}

const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;
const formatNumber = (value: number) => value.toLocaleString();

export default function AnalyticsTrendChart({ 
  data, 
  height = 350, 
  compact = false 
}: AnalyticsTrendChartProps) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    revenue: true,
    orders: true,
    completedOrders: true,
    avgOrderValue: false // Start hidden since it might crowd the chart
  });

  // Calculate average order value if not provided
  const enrichedData = data.map(item => ({
    ...item,
    avgOrderValue: item.avgOrderValue || (item.orders > 0 ? item.revenue / item.orders : 0)
  }));

  const allMetrics: ChartMetric[] = [
    {
      key: 'revenue',
      name: 'Revenue (₱)',
      color: '#f97316', // orange-500
      format: formatCurrency
    },
    {
      key: 'orders',
      name: 'Total Orders',
      color: '#06b6d4', // cyan-500
      format: formatNumber
    },
    {
      key: 'completedOrders',
      name: 'Completed Orders',
      color: '#10b981', // emerald-500
      format: formatNumber
    },
    {
      key: 'avgOrderValue',
      name: 'Avg Order Value (₱)',
      color: '#8b5cf6', // violet-500 (avoiding per rules, using purple)
      format: formatCurrency
    }
  ];

  // Filter metrics based on visibility
  const activeMetrics = allMetrics.filter(metric => 
    visibleMetrics[metric.key as keyof typeof visibleMetrics]
  );

  const toggleMetric = (key: string) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-bold text-foreground">Analytics Trend Chart</h3>
        
        {/* Metric Toggles */}
        <div className="flex flex-wrap gap-2">
          {allMetrics.map((metric) => {
            const isVisible = visibleMetrics[metric.key as keyof typeof visibleMetrics];
            return (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  isVisible
                    ? 'bg-primary text-white'
                    : 'bg-background text-muted hover:bg-surface'
                }`}
              >
                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                <span style={{ color: isVisible ? 'white' : metric.color }}>
                  {metric.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeMetrics.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted">
          <p>Select at least one metric to display the chart</p>
        </div>
      ) : (
        <TrendChart
          data={enrichedData}
          metrics={activeMetrics}
          chartType="line"
          height={height}
          showGrid={true}
          showLegend={true}
          compact={compact}
        />
      )}
      
      <div className="mt-3 text-xs text-muted">
        <p>• Click the metric buttons above to show/hide trends</p>
        <p>• Revenue and Average Order Value use currency formatting (₱)</p>
        <p>• Orders show count values</p>
      </div>
    </div>
  );
} 