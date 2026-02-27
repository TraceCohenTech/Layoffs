export interface LayoffEntry {
  company: string;
  locationHQ: string;
  laidOff: number | null;
  date: string;
  percentage: number | null;
  industry: string;
  source: string;
  stage: string;
  raisedMM: number | null;
  country: string;
  dateAdded: string;
  division?: string;
  aiRelated?: boolean;
}

export interface Headline {
  text: string;
  source: string;
  company: string;
  date: string;
  type: 'quote' | 'headline' | 'stat';
}

export interface MonthlyData {
  month: string;
  year: number;
  monthNum: number;
  count: number;
  totalLaidOff: number;
  companies: number;
}

export interface IndustryData {
  industry: string;
  totalLaidOff: number;
  companies: number;
}

export interface CountryData {
  country: string;
  totalLaidOff: number;
  companies: number;
}

export interface StageData {
  stage: string;
  count: number;
  totalLaidOff: number;
}

export interface YearData {
  year: number;
  totalLaidOff: number;
  companies: number;
}

export interface HeatmapCell {
  month: number;
  monthName: string;
  year: number;
  value: number;
}

export interface FilterState {
  yearRange: [number, number];
  industry: string;
  country: string;
  search: string;
}

export interface KPIData {
  totalLaidOff: number;
  totalCompanies: number;
  averageSize: number;
  largestLayoff: number;
  largestCompany: string;
  topIndustry: string;
  topIndustryCount: number;
  dateRange: string;
}
