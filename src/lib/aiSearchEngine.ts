import { Supplier, SearchFilterState } from '../types';

export interface ParsedQuery {
  rawQuery: string;
  detectedCategories: string[];
  detectedCertifications: string[];
  detectedMaterials: string[];
  detectedLocation: string | null;
  wantsFiveAxis: boolean;
  wantsLowMoq: boolean;
  wantsQuickTurn: boolean;
  cleanKeywords: string[];
}

export function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const q = query.toLowerCase();
  
  // Detect Categories
  const detectedCategories: string[] = [];
  if (q.includes('cnc') || q.includes('machin') || q.includes('milling') || q.includes('turning') || q.includes('lathe')) {
    detectedCategories.push('CNC Machining');
  }
  if (q.includes('sheet') || q.includes('laser') || q.includes('bending') || q.includes('fabricat') || q.includes('enclosure')) {
    detectedCategories.push('Sheet Metal & Fabrication');
  }
  if (q.includes('mold') || q.includes('mould') || q.includes('plastic') || q.includes('injection') || q.includes('polymer')) {
    detectedCategories.push('Injection Molding');
  }
  if (q.includes('pcb') || q.includes('circuit') || q.includes('smt') || q.includes('electronics') || q.includes('assembly')) {
    detectedCategories.push('Electronics & PCBA');
  }
  if (q.includes('cast') || q.includes('forg') || q.includes('foundry') || q.includes('heat treat')) {
    detectedCategories.push('Casting & Forging');
  }

  // Detect Certifications
  const detectedCertifications: string[] = [];
  if (q.includes('iso 9001') || q.includes('9001')) detectedCertifications.push('ISO 9001:2015');
  if (q.includes('as9100') || q.includes('aerospace') || q.includes('as 9100') || q.includes('flight')) detectedCertifications.push('AS9100D');
  if (q.includes('iatf') || q.includes('automotive') || q.includes('16949')) detectedCertifications.push('IATF 16949');
  if (q.includes('13485') || q.includes('medical') || q.includes('biomedical')) detectedCertifications.push('ISO 13485');
  if (q.includes('14001') || q.includes('environmental')) detectedCertifications.push('ISO 14001');
  if (q.includes('ipc') || q.includes('610')) detectedCertifications.push('IPC-A-610');

  // Detect Materials
  const detectedMaterials: string[] = [];
  if (q.includes('titanium') || q.includes('ti-6al-4v')) detectedMaterials.push('Titanium');
  if (q.includes('aluminum') || q.includes('aluminium') || q.includes('6061') || q.includes('7075')) detectedMaterials.push('Aluminum');
  if (q.includes('stainless') || q.includes('steel') || q.includes('316l') || q.includes('304')) detectedMaterials.push('Stainless Steel');
  if (q.includes('peek') || q.includes('delrin') || q.includes('polycarbonate')) detectedMaterials.push('PEEK');
  if (q.includes('inconel') || q.includes('superalloy') || q.includes('nickel alloy')) detectedMaterials.push('Inconel');
  if (q.includes('fr-4') || q.includes('fr4') || q.includes('rogers')) detectedMaterials.push('FR-4');

  // Detect Locations
  let detectedLocation: string | null = null;
  const indianCities = ['bangalore', 'bengaluru', 'pune', 'chennai', 'hyderabad', 'coimbatore', 'mumbai', 'delhi', 'gurgaon', 'noida', 'ahmedabad'];
  for (const city of indianCities) {
    if (q.includes(city)) {
      detectedLocation = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Keywords extraction
  const stopWords = new Set(['find', 'me', 'a', 'an', 'the', 'with', 'and', 'for', 'in', 'of', 'shops', 'suppliers', 'shop', 'supplier', 'company', 'looking']);
  const words = q.replace(/[^a-zA-Z0-9\s-]/g, '').split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w));

  return {
    rawQuery: query,
    detectedCategories,
    detectedCertifications,
    detectedMaterials,
    detectedLocation,
    wantsFiveAxis: q.includes('5-axis') || q.includes('5 axis') || q.includes('five axis'),
    wantsLowMoq: q.includes('low moq') || q.includes('prototyp') || q.includes('small batch') || q.includes('moq under'),
    wantsQuickTurn: q.includes('fast') || q.includes('quick') || q.includes('urgent') || q.includes('rapid'),
    cleanKeywords: words,
  };
}
