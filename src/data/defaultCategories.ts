export const CATEGORIES = [
  'CNC Machining',
  'Sheet Metal & Fabrication',
  'Injection Molding',
  'Electronics & PCBA',
  'Casting & Forging',
] as const;

export const CERTIFICATIONS_LIST = [
  { code: 'ISO 9001:2015', name: 'Quality Management System', priority: 'High' },
  { code: 'AS9100D', name: 'Aerospace & Defense Standard', priority: 'High' },
  { code: 'IATF 16949', name: 'Automotive Quality Management', priority: 'High' },
  { code: 'ISO 13485', name: 'Medical Devices Quality', priority: 'High' },
  { code: 'ISO 14001', name: 'Environmental Management', priority: 'Medium' },
  { code: 'RoHS / REACH', name: 'Hazardous Substance Compliance', priority: 'Medium' },
  { code: 'IPC-A-610', name: 'Electronics Assembly Acceptability', priority: 'Medium' },
];

export const POPULAR_MATERIALS = [
  'Aluminum 6061-T6',
  'Stainless Steel 316L',
  'Titanium Gr5',
  'ABS / Polycarbonate',
  'FR-4 PCB Core',
  'Brass C360',
  'PEEK / Delrin',
  'Inconel 718',
];

export const POPULAR_AI_PROMPTS = [
  "Find ISO 9001 certified CNC machine shops in Bangalore with 5-axis milling",
  "Sheet metal fabricators with laser cutting & powder coating, MOQ under 50",
  "High precision medical device injection molders with cleanroom & ISO 13485",
  "Turnkey PCB assembly with SMT pick-and-place and BGA inspection",
  "Aerospace AS9100 certified titanium machining with CMM inspection",
];
