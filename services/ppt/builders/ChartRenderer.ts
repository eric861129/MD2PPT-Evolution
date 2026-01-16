/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { BlockType, ParsedBlock } from "../../types";
import { BlockRenderer, RenderContext } from "./types";
import { transformTableToChartData } from "../../../utils/chartDataTransformer";
import { PPT_THEME } from "../../../constants/theme";

// Chart colors (matching Recharts)
const COLORS = ['#EA580C', '#F59E0B', '#0EA5E9', '#84CC16', '#10B981', '#6366F1'];

export const ChartRenderer: BlockRenderer = {
  type: BlockType.CHART,
  render: (block: ParsedBlock, context: RenderContext): number => {
    const { pptx, slide, x, y, w, options } = context;
    const { chartType = 'bar', title, showLegend, showValues } = block.metadata || {};
    
    if (!block.tableRows) return y;

    const { labels, datasets } = transformTableToChartData(block.tableRows);

    if (datasets.length === 0) return y;

    // Transform to PptxGenJS format
    const chartData = datasets.map(ds => ({
      name: ds.name,
      labels: labels,
      values: ds.values
    }));

    // Map chart type
    let type: any = pptx.ChartType.bar;
    switch (chartType) {
      case 'line': type = pptx.ChartType.line; break;
      case 'pie': type = pptx.ChartType.pie; break;
      case 'area': type = pptx.ChartType.area; break;
      case 'bar': default: type = pptx.ChartType.bar; break;
    }

    const chartColors = options.theme?.colors.chart || COLORS;

    // Chart Options
    const chartOpts: any = {
      x, y, w, h: 3.5,
      showTitle: !!title,
      title: title || '',
      showLegend: showLegend !== false,
      showValue: !!showValues,
      chartColors: chartColors,
      legendPos: 'b',
      barDir: 'col', // vertical bars
      // Theme integration
      titleColor: options.isDark ? "FFFFFF" : (options.theme?.colors.text || PPT_THEME.COLORS.TEXT_MAIN),
      titleFontSize: 14,
      valColor: options.isDark ? "E7E5E4" : (options.theme?.colors.text || "44403C"),
      catAxisLabelColor: options.isDark ? "A8A29E" : "57534E",
      valAxisLabelColor: options.isDark ? "A8A29E" : "57534E",
      gridLineColor: options.isDark ? "44403C" : "E5E7EB"
    };

    // Special handling for Pie charts (usually single series)
    if (chartType === 'pie') {
      // Use only first dataset
      const pieData = [chartData[0]];
      slide.addChart(type, pieData, chartOpts);
    } else {
      slide.addChart(type, chartData, chartOpts);
    }

    return y + 3.8; // Chart height + margin
  }
};
