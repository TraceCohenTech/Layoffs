import type { CompanyFinancials } from '../types';

// Revenue data for ~23 major tech companies
// Sources: Bullfincher.io, MacroTrends, public filings (TTM or FY2025)
// revenuePerEmployee is pre-computed: revenueMillions * 1_000_000 / employeeCount

export const financialsData: CompanyFinancials[] = [
  // Big Tech
  { company: 'NVIDIA', sector: 'Semiconductors', revenueMillions: 130497, employeeCount: 36000, revenuePerEmployee: 3624917 },
  { company: 'Apple', sector: 'Big Tech', revenueMillions: 391035, employeeCount: 161000, revenuePerEmployee: 2428168 },
  { company: 'Meta', sector: 'Big Tech', revenueMillions: 164710, employeeCount: 72404, revenuePerEmployee: 2274821 },
  { company: 'Alphabet', sector: 'Big Tech', revenueMillions: 350018, employeeCount: 183323, revenuePerEmployee: 1909367 },
  { company: 'Microsoft', sector: 'Big Tech', revenueMillions: 254190, employeeCount: 228000, revenuePerEmployee: 1114868 },
  { company: 'Amazon', sector: 'Big Tech', revenueMillions: 637997, employeeCount: 1568000, revenuePerEmployee: 406885 },

  // Semiconductors
  { company: 'Broadcom', sector: 'Semiconductors', revenueMillions: 51574, employeeCount: 20000, revenuePerEmployee: 2578700 },
  { company: 'AMD', sector: 'Semiconductors', revenueMillions: 25785, employeeCount: 26000, revenuePerEmployee: 991731 },
  { company: 'Intel', sector: 'Semiconductors', revenueMillions: 54228, employeeCount: 108900, revenuePerEmployee: 498052 },
  { company: 'Qualcomm', sector: 'Semiconductors', revenueMillions: 41816, employeeCount: 51000, revenuePerEmployee: 819922 },

  // Cybersecurity
  { company: 'Palo Alto Networks', sector: 'Cybersecurity', revenueMillions: 8155, employeeCount: 16200, revenuePerEmployee: 503395 },
  { company: 'CrowdStrike', sector: 'Cybersecurity', revenueMillions: 3954, employeeCount: 10680, revenuePerEmployee: 370225 },
  { company: 'Fortinet', sector: 'Cybersecurity', revenueMillions: 5960, employeeCount: 13800, revenuePerEmployee: 431884 },

  // Defense
  { company: 'Palantir', sector: 'Defense & AI', revenueMillions: 2870, employeeCount: 3938, revenuePerEmployee: 728796 },
  { company: 'Lockheed Martin', sector: 'Defense & AI', revenueMillions: 71040, employeeCount: 122000, revenuePerEmployee: 582295 },

  // SaaS
  { company: 'Salesforce', sector: 'SaaS', revenueMillions: 37884, employeeCount: 72682, revenuePerEmployee: 521267 },
  { company: 'ServiceNow', sector: 'SaaS', revenueMillions: 10984, employeeCount: 24762, revenuePerEmployee: 443519 },
  { company: 'Workday', sector: 'SaaS', revenueMillions: 8446, employeeCount: 18800, revenuePerEmployee: 449255 },

  // Healthcare
  { company: 'UnitedHealth', sector: 'Healthcare', revenueMillions: 400278, employeeCount: 440000, revenuePerEmployee: 909723 },

  // AI-Native
  { company: 'Anthropic', sector: 'AI-Native', revenueMillions: 2000, employeeCount: 1200, revenuePerEmployee: 1666667 },
  { company: 'OpenAI', sector: 'AI-Native', revenueMillions: 5000, employeeCount: 3400, revenuePerEmployee: 1470588 },

  // Logistics / Other
  { company: 'UPS', sector: 'Logistics', revenueMillions: 89050, employeeCount: 490000, revenuePerEmployee: 181735 },
  { company: 'Cisco', sector: 'Networking', revenueMillions: 53800, employeeCount: 90400, revenuePerEmployee: 595133 },
];

// Sector color mapping for charts
export const SECTOR_COLORS: Record<string, string> = {
  'Big Tech': '#2563eb',
  'Semiconductors': '#059669',
  'Cybersecurity': '#7c3aed',
  'Defense & AI': '#dc2626',
  'SaaS': '#d97706',
  'Healthcare': '#db2777',
  'AI-Native': '#0891b2',
  'Logistics': '#65a30d',
  'Networking': '#64748b',
};
