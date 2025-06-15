'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

export type ChartType = 'line' | 'bar' | 'composed';

export interface ChartMetric {
  key: string;
  name: string;
  color: string;
  type?: 'line' | 'bar';
  yAxisId?: 'left' | 'right';
  format?: (value: number) => string;
}

export interface TrendChartProps {
  data: any[];
  metrics: ChartMetric[];
  chartType?: ChartType;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  xAxisKey?: string;
  compact?: boolean;
}

const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;
const formatNumber = (value: number) => value.toLocaleString();

export default function TrendChart({
  data,
  metrics,
  chartType = 'line',
  height = 300,
  showGrid = true,
  showLegend = true,
  xAxisKey = 'date',
  compact = false
}: TrendChartProps) {
  const formatXAxisLabel = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">
            {new Date(label).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.key === entry.dataKey);
            const formatter = metric?.format || formatNumber;
            return (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: {formatter(entry.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const fontSize = compact ? 10 : 12;
  const tickMargin = compact ? 2 : 5;

  if (chartType === 'composed') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={formatXAxisLabel}
            fontSize={fontSize}
            tick={{ fill: 'currentColor' }}
            tickMargin={tickMargin}
          />
          <YAxis
            yAxisId="left"
            fontSize={fontSize}
            tick={{ fill: 'currentColor' }}
            tickFormatter={formatCurrency}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            fontSize={fontSize}
            tick={{ fill: 'currentColor' }}
            tickFormatter={formatNumber}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend fontSize={fontSize} />}
          
          {metrics.map((metric) => {
            if (metric.type === 'bar') {
              return (
                <Bar
                  key={metric.key}
                  yAxisId={metric.yAxisId || 'left'}
                  dataKey={metric.key}
                  name={metric.name}
                  fill={metric.color}
                  fillOpacity={0.8}
                />
              );
            } else {
              return (
                <Line
                  key={metric.key}
                  yAxisId={metric.yAxisId || 'left'}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.name}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ fill: metric.color, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              );
            }
          })}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={formatXAxisLabel}
            fontSize={fontSize}
            tick={{ fill: 'currentColor' }}
            tickMargin={tickMargin}
          />
          <YAxis
            fontSize={fontSize}
            tick={{ fill: 'currentColor' }}
            tickFormatter={metrics[0]?.format || formatNumber}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend fontSize={fontSize} />}
          
          {metrics.map((metric) => (
            <Bar
              key={metric.key}
              dataKey={metric.key}
              name={metric.name}
              fill={metric.color}
              fillOpacity={0.8}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={formatXAxisLabel}
          fontSize={fontSize}
          tick={{ fill: 'currentColor' }}
          tickMargin={tickMargin}
        />
        <YAxis
          fontSize={fontSize}
          tick={{ fill: 'currentColor' }}
          tickFormatter={metrics[0]?.format || formatNumber}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend fontSize={fontSize} />}
        
        {metrics.map((metric) => (
          <Line
            key={metric.key}
            type="monotone"
            dataKey={metric.key}
            name={metric.name}
            stroke={metric.color}
            strokeWidth={2}
            dot={{ fill: metric.color, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
} 