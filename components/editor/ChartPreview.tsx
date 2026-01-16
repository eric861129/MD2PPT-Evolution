/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { ParsedBlock, PptTheme } from '../../services/types';
import { transformTableToChartData } from '../../utils/chartDataTransformer';

interface ChartPreviewProps {
  block: ParsedBlock;
  isDark?: boolean;
  theme: PptTheme;
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({ block, isDark, theme }) => {
  const { chartType, title, showLegend, showValues } = block.metadata || {};
  const chartColors = theme.colors.chart;
  
  const { data, seriesNames } = useMemo(() => {
    if (!block.tableRows) return { data: [], seriesNames: [] };
    
    const transformed = transformTableToChartData(block.tableRows);
    
    const rechartsData = transformed.labels.map((label, i) => {
      const item: any = { name: label };
      transformed.datasets.forEach(ds => {
        item[ds.name] = ds.values[i];
      });
      return item;
    });
    
    const names = transformed.datasets.map(ds => ds.name);
    return { data: rechartsData, seriesNames: names };
  }, [block.tableRows]);

  if (!data || data.length === 0) {
    return <div className="text-stone-400 p-4 text-center">No chart data</div>;
  }

  // Common props
  const axisColor = isDark ? '#A8A29E' : '#57534E';
  const gridColor = isDark ? '#44403C' : '#E7E5E4';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1C1917' : '#FFFFFF',
    borderColor: isDark ? '#44403C' : '#E7E5E4',
    color: isDark ? '#F5F5F4' : '#1C1917'
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend !== false && <Legend />}
            {seriesNames.map((name, i) => (
              <Line 
                key={name} 
                type="monotone" 
                dataKey={name} 
                stroke={chartColors[i % chartColors.length]} 
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );
        
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend !== false && <Legend />}
            {seriesNames.map((name, i) => (
              <Area 
                key={name} 
                type="monotone" 
                dataKey={name} 
                stroke={chartColors[i % chartColors.length]} 
                fill={chartColors[i % chartColors.length]} 
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        const pieDataKey = seriesNames[0];
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={pieDataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={showValues}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend !== false && <Legend />}
          </PieChart>
        );

      case 'bar':
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend !== false && <Legend />}
            {seriesNames.map((name, i) => (
              <Bar key={name} dataKey={name} fill={chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full my-8">
      {title && (
        <div className="text-center mb-4 font-bold text-lg text-stone-600 dark:text-stone-300">
          {title}
        </div>
      )}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};