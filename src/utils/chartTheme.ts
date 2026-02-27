// Shared chart styling constants — Apple-quality light theme

export const TOOLTIP_STYLE = {
  backgroundColor: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  color: '#1e293b',
  fontSize: '13px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
  padding: '10px 14px',
} as const;

export const TOOLTIP_LABEL_STYLE = { color: '#475569', fontWeight: 600 } as const;

export const GRID_STROKE = '#f1f5f9';
export const AXIS_TICK_FILL = '#64748b';
export const AXIS_LINE_STROKE = '#e2e8f0';
export const AXIS_FONT_SIZE = 12;

// Bold 8-color chart palette — high saturation, perceptually distinct
export const CHART_COLORS = [
  '#2563eb', // blue-600
  '#dc2626', // red-600
  '#059669', // emerald-600
  '#d97706', // amber-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#0891b2', // cyan-600
  '#65a30d', // lime-600
] as const;

// Single-hue blue scale for heatmaps
export const HEATMAP_SCALE = [
  '#f1f5f9', // slate-100 (zero/empty)
  '#dbeafe', // blue-100
  '#93c5fd', // blue-300
  '#3b82f6', // blue-500
  '#1d4ed8', // blue-700
] as const;

// AI / violet theme
export const AI_COLOR = '#7c3aed'; // violet-600
export const AI_COLOR_LIGHT = '#ede9fe'; // violet-50

// Year colors (bold)
export const YEAR_COLORS: Record<number, string> = {
  2020: '#dc2626',
  2021: '#d97706',
  2022: '#ea580c',
  2023: '#2563eb',
  2024: '#059669',
  2025: '#7c3aed',
  2026: '#db2777',
};
