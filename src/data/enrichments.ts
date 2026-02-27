import type { LayoffEntry, Headline } from '../types';

// ============================================================
// Division-level enrichment: keyed by "Company|Date"
// ============================================================
interface DivisionEnrichment {
  division: string;
  aiRelated?: boolean;
}

const divisionMap: Record<string, DivisionEnrichment> = {
  // Google
  'Google|4/11/2025': { division: 'Platforms & Devices (Android, Chrome, Pixel)', aiRelated: true },
  'Google|2/27/2025': { division: 'Cloud Division' },
  'Google|1/15/2025': { division: 'Platforms & Devices (Fitbit, Nest)', aiRelated: true },
  'Google|6/24/2025': { division: 'Smart TV Division', aiRelated: true },
  'Google|10/1/2025': { division: 'Global Business Unit' },
  'Google|10/2/2025': { division: 'Cloud / AI Infrastructure' },
  'Google|1/10/2024': { division: 'Hardware, Eng, Google Assistant', aiRelated: true },
  'Google|1/17/2023': { division: 'Company-wide' },

  // Meta
  'Meta|1/13/2026': { division: 'Reality Labs (VR/Metaverse)', aiRelated: true },
  'Meta|10/22/2025': { division: 'FAIR (AI Research Group)', aiRelated: true },
  'Meta|2/10/2025': { division: 'Company-wide ("Low Performers")', aiRelated: true },
  'Meta|4/24/2025': { division: 'WhatsApp / Business Platform' },
  'Meta|11/9/2022': { division: 'Company-wide' },
  'Meta|3/14/2023': { division: 'Company-wide' },
  'Meta|4/18/2023': { division: 'Company-wide' },

  // Amazon
  'Amazon|1/28/2026': { division: 'Corporate / AWS / HR / Prime Video', aiRelated: true },
  'Amazon|10/27/2025': { division: 'Corporate (Anti-bureaucracy Push)', aiRelated: true },
  'Amazon|5/14/2025': { division: 'Alexa / Devices & Services', aiRelated: true },
  'Amazon|1/4/2023': { division: 'Company-wide (18,000)' },
  'Amazon|3/20/2023': { division: 'Company-wide (9,000 additional)' },
  'Amazon|11/16/2022': { division: 'Devices & Services' },

  // Microsoft
  'Microsoft|7/2/2025': { division: 'Xbox / Gaming Studios', aiRelated: false },
  'Microsoft|5/13/2025': { division: 'Gaming (King, Zenimax, Turn 10)' },
  'Microsoft|6/2/2025': { division: 'Cloud & Sales' },
  'Microsoft|9/8/2025': { division: 'HoloLens / Mixed Reality' },
  'Microsoft|1/19/2023': { division: 'Company-wide' },
  'Microsoft|1/18/2024': { division: 'Gaming (Activision Blizzard)' },

  // Salesforce
  'Salesforce|8/31/2025': { division: 'Customer Support (Replaced by AI Agents)', aiRelated: true },
  'Salesforce|9/4/2025': { division: 'Sales / Account Executives', aiRelated: true },
  'Salesforce|2/9/2026': { division: 'Executive Restructuring' },
  'Salesforce|1/4/2023': { division: 'Company-wide' },

  // Intel
  'Intel|4/23/2025': { division: 'Company-wide (CEO Restructuring)', aiRelated: true },
  'Intel|7/11/2025': { division: 'Intel Foundry (Factory Workers)', aiRelated: false },
  'Intel|8/1/2024': { division: 'Company-wide ($10B Cost Cut)' },

  // Others with known divisions
  'Workday|2/4/2026': { division: 'Customer Support', aiRelated: true },
  'Pinterest|1/27/2026': { division: 'Company-wide (AI Transformation)', aiRelated: true },
  'Block|2/26/2026': { division: 'Company-wide (AI Restructuring)', aiRelated: true },
  'WiseTech|2/24/2026': { division: 'Engineering (AI replacing manual coding)', aiRelated: true },
  'Chegg|10/27/2025': { division: 'Company-wide (ChatGPT disruption)', aiRelated: true },
  'Chegg|6/8/2023': { division: 'Content / Tutoring', aiRelated: true },
  'Cisco|8/9/2024': { division: 'Talos Security & Engineering' },
  'Cisco|2/14/2024': { division: 'Company-wide' },
  'Deepwatch|11/12/2025': { division: 'Engineering (AI Investment Pivot)', aiRelated: true },
  'DraftKings|2/24/2026': { division: 'Company-wide (AI Adoption)', aiRelated: true },
};

// ============================================================
// AI-related companies (broader tagging by company+date pattern)
// These are layoffs explicitly attributed to AI in reporting
// ============================================================
const aiRelatedPatterns: Array<{ company: string; dateAfter?: string }> = [
  { company: 'Chegg' },  // entire company disrupted by AI
  { company: 'Duolingo' },
  { company: 'Klarna', dateAfter: '1/1/2024' },
  { company: 'Salesforce', dateAfter: '1/1/2025' },
  { company: 'Block', dateAfter: '1/1/2026' },
  { company: 'WiseTech' },
  { company: 'Deepwatch' },
];

// ============================================================
// New companies missing from layoffs.fyi
// ============================================================
export const additionalEntries: LayoffEntry[] = [
  // Verizon - massive telecom layoffs
  {
    company: 'Verizon', locationHQ: 'New York City', laidOff: 4400, date: '12/11/2024',
    percentage: 4, industry: 'Telecom', source: 'https://www.reuters.com/business/media-telecom/verizon-cut-4400-jobs-through-voluntary-severance-2024-12-11/',
    stage: 'Post-IPO', raisedMM: null, country: 'United States', dateAdded: '12/11/2024',
  },
  {
    company: 'Verizon', locationHQ: 'New York City', laidOff: 4900, date: '3/19/2025',
    percentage: 5, industry: 'Telecom', source: 'https://www.fiercetelecom.com/telecom/verizon-cut-another-4900-jobs-second-round-layoffs',
    stage: 'Post-IPO', raisedMM: null, country: 'United States', dateAdded: '3/19/2025',
    aiRelated: true, division: 'Network Engineering & Customer Service',
  },
  {
    company: 'Verizon', locationHQ: 'New York City', laidOff: 4000, date: '9/15/2025',
    percentage: 4, industry: 'Telecom', source: 'https://www.lightreading.com/5g/verizon-to-cut-4000-more-jobs-total-reaches-13000',
    stage: 'Post-IPO', raisedMM: null, country: 'United States', dateAdded: '9/15/2025',
    aiRelated: true, division: 'Corporate & Technology',
  },

  // Chevron
  {
    company: 'Chevron', locationHQ: 'Houston', laidOff: 8000, date: '3/5/2025',
    percentage: 17, industry: 'Energy', source: 'https://www.reuters.com/business/energy/chevron-cut-up-20-workforce-by-end-2026-2025-03-05/',
    stage: 'Post-IPO', raisedMM: null, country: 'United States', dateAdded: '3/5/2025',
    division: 'Corporate & Global Workforce',
  },

  // Accenture
  {
    company: 'Accenture', locationHQ: 'Dublin Non-U.S.', laidOff: 11000, date: '6/15/2025',
    percentage: 1.5, industry: 'Consulting', source: 'https://www.reuters.com/business/accenture-cut-jobs-ai-automation-2025-06-15/',
    stage: 'Post-IPO', raisedMM: null, country: 'Ireland', dateAdded: '6/15/2025',
    aiRelated: true, division: 'Operations & Delivery (AI Reskilling)',
  },

  // Duolingo
  {
    company: 'Duolingo', locationHQ: 'Pittsburgh', laidOff: 50, date: '1/8/2025',
    percentage: 10, industry: 'Education', source: 'https://www.theverge.com/2025/1/8/24337750/duolingo-contractor-layoffs-ai-translation',
    stage: 'Post-IPO', raisedMM: 183, country: 'United States', dateAdded: '1/8/2025',
    aiRelated: true, division: 'Contract Translators & Writers (Replaced by AI)',
  },

  // UPS - the really big ones not tracked properly
  {
    company: 'UPS', locationHQ: 'Atlanta', laidOff: 12000, date: '1/30/2024',
    percentage: 3, industry: 'Logistics', source: 'https://www.cnbc.com/2024/01/30/ups-to-cut-12000-jobs.html',
    stage: 'Post-IPO', raisedMM: null, country: 'United States', dateAdded: '1/30/2024',
    division: 'Management & Corporate',
  },
  {
    company: 'UPS', locationHQ: 'Atlanta', laidOff: 20000, date: '4/29/2025',
    percentage: 5, industry: 'Logistics', source: 'https://www.wsj.com/business/logistics/ups-to-cut-20000-jobs-close-73-facilities-c52fdd2a',
    stage: 'Post-IPO', raisedMM: null, country: 'United States', dateAdded: '4/29/2025',
    aiRelated: true, division: 'Operations & Facilities (73 Facilities Closing)',
  },

  // Klarna - the famous AI reversal
  {
    company: 'Klarna', locationHQ: 'Stockholm Non-U.S.', laidOff: 700, date: '8/27/2024',
    percentage: 10, industry: 'Finance', source: 'https://finance.yahoo.com/news/firing-700-humans-ai-klarna-173029838.html',
    stage: 'Post-IPO', raisedMM: 4600, country: 'Sweden', dateAdded: '8/27/2024',
    aiRelated: true, division: 'Customer Service (Replaced by AI, Later Reversed)',
  },
];

// ============================================================
// Headlines ticker data
// ============================================================
export const headlines: Headline[] = [
  {
    text: '"I\'ve reduced it from 9,000 heads to about 5,000 because I need less heads."',
    source: 'Fortune',
    company: 'Marc Benioff, Salesforce CEO',
    date: 'Sep 2025',
    type: 'quote',
  },
  {
    text: '"Before asking for more headcount, teams must demonstrate why they cannot get what they want done using AI."',
    source: 'CNBC',
    company: 'Tobi Lutke, Shopify CEO',
    date: 'Apr 2025',
    type: 'quote',
  },
  {
    text: '"The announcement was not really financially driven, and it\'s not even really AI-driven... Bureaucracy is anathema to startups."',
    source: 'GeekWire',
    company: 'Andy Jassy, Amazon CEO',
    date: 'Oct 2025',
    type: 'quote',
  },
  {
    text: '"I\'ve decided to raise the bar on performance management and move out low performers faster."',
    source: 'Internal Memo',
    company: 'Mark Zuckerberg, Meta CEO',
    date: 'Jan 2025',
    type: 'quote',
  },
  {
    text: '"Those we cannot reskill will be exited."',
    source: 'Reuters',
    company: 'Julie Sweet, Accenture CEO',
    date: 'Jun 2025',
    type: 'quote',
  },
  {
    text: '"As cost unfortunately seems to have been a too predominant evaluation factor... what you end up having is lower quality."',
    source: 'Fortune',
    company: 'Sebastian Siemiatkowski, Klarna CEO',
    date: 'Aug 2024',
    type: 'quote',
  },
  {
    text: '"We, as the producers of this technology, have a duty to be honest about what is coming."',
    source: 'Fortune',
    company: 'Dario Amodei, Anthropic CEO',
    date: 'May 2025',
    type: 'quote',
  },
  {
    text: '55,000 jobs explicitly attributed to AI in 2025 -- 12x the number from just two years prior',
    source: 'Challenger, Gray & Christmas',
    company: '',
    date: '2025',
    type: 'stat',
  },
  {
    text: '55% of employers report regretting AI-driven layoffs; half expected to reverse by end of 2026',
    source: 'Forrester / HR Executive',
    company: '',
    date: '2026',
    type: 'stat',
  },
  {
    text: 'Meta Reality Labs: $73 billion in cumulative losses since 2020, VR studios shuttered for AI pivot',
    source: 'CNBC',
    company: 'Meta',
    date: 'Jan 2026',
    type: 'headline',
  },
  {
    text: 'Chegg stock crashes 99% from peak as ChatGPT destroys core business; 55%+ workforce cut',
    source: 'Reuters',
    company: 'Chegg',
    date: '2025',
    type: 'headline',
  },
  {
    text: 'Intel reports first annual loss since 1986 ($19B); 35,000+ jobs cut in 18 months',
    source: 'TechCrunch',
    company: 'Intel',
    date: '2024-2025',
    type: 'headline',
  },
  {
    text: 'Microsoft cancels Perfect Dark, Everwild; closes studios in 4th major gaming layoff round',
    source: 'Game Informer',
    company: 'Microsoft',
    date: 'Jul 2025',
    type: 'headline',
  },
  {
    text: '44% of hiring managers anticipate AI will be a top layoff driver in 2026',
    source: 'HR Dive',
    company: '',
    date: '2026',
    type: 'stat',
  },
  {
    text: 'Companies are laying off based on AI\'s potential, not its actual performance',
    source: 'Harvard Business Review',
    company: '',
    date: 'Jan 2026',
    type: 'headline',
  },
  {
    text: 'Klarna replaces 700 agents with AI, quality collapses, CEO admits mistake and begins rehiring',
    source: 'Fortune',
    company: 'Klarna',
    date: '2024-2025',
    type: 'headline',
  },
  {
    text: 'UPS to close 73 facilities and cut 20,000 jobs as automation reshapes logistics',
    source: 'Wall Street Journal',
    company: 'UPS',
    date: 'Apr 2025',
    type: 'headline',
  },
  {
    text: 'Google offers voluntary buyouts to entire 20,000-person Platforms & Devices division',
    source: 'HR Digest',
    company: 'Google',
    date: 'Jan 2025',
    type: 'headline',
  },
];

// ============================================================
// Estimated total workforce by company (for % of workforce calc)
// ============================================================
const WORKFORCE_DATA: Record<string, number> = {
  'Intel': 124000,
  'Verizon': 105000,
  'Dell': 133000,
  'Ford': 177000,
  'PwC': 75000,
  'Salesforce': 73000,
  'IBM': 288000,
  'American Airlines': 130000,
  'Paramount': 24500,
  'General Motors': 163000,
  'Applied Materials': 34000,
  'Meta': 67000,
  'UPS': 490000,
  'Amazon': 1560000,
  'Microsoft': 221000,
  'Accenture': 801000,
  'Target': 440000,
  'Kroger': 409000,
};

// ============================================================
// Apply enrichments to base data
// ============================================================
export function enrichData(baseData: LayoffEntry[]): LayoffEntry[] {
  const enriched = baseData.map(entry => {
    const key = `${entry.company}|${entry.date}`;
    const enrichment = divisionMap[key];

    // Check AI patterns
    let aiRelated = enrichment?.aiRelated ?? false;
    if (!aiRelated) {
      for (const pattern of aiRelatedPatterns) {
        if (entry.company === pattern.company) {
          if (!pattern.dateAfter) {
            aiRelated = true;
          } else {
            const entryParts = entry.date.split('/');
            const patternParts = pattern.dateAfter.split('/');
            const entryDate = new Date(parseInt(entryParts[2]), parseInt(entryParts[0]) - 1, parseInt(entryParts[1]));
            const afterDate = new Date(parseInt(patternParts[2]), parseInt(patternParts[0]) - 1, parseInt(patternParts[1]));
            if (entryDate >= afterDate) aiRelated = true;
          }
        }
      }
    }

    const estEmployees = WORKFORCE_DATA[entry.company] ?? entry.estEmployees;
    let percentage = entry.percentage;
    if (!percentage && estEmployees && entry.laidOff) {
      percentage = Math.round((entry.laidOff / estEmployees) * 1000) / 10;
    }

    return {
      ...entry,
      division: enrichment?.division ?? entry.division,
      aiRelated: aiRelated || entry.aiRelated,
      estEmployees,
      percentage,
    };
  });

  // Add new companies
  return [...enriched, ...additionalEntries];
}
