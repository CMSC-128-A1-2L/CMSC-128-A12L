export interface Country {
  code: string;
  name: string;
  pattern: RegExp;
  prefix: string;
}

export const COUNTRIES: Country[] = [
  { code: 'PH', name: 'Philippines', pattern: /^(\+63|0)[9]\d{9}$/, prefix: '+63' },
  { code: 'US', name: 'United States', pattern: /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, prefix: '+1' },
  { code: 'UK', name: 'United Kingdom', pattern: /^\+?44\s?(\d{2,4}|\(\d{2,4}\))\s?\d{3,4}\s?\d{3,4}$/, prefix: '+44' },
  { code: 'AU', name: 'Australia', pattern: /^\+?61\s?\d{9}$/, prefix: '+61' },
  { code: 'CA', name: 'Canada', pattern: /^\+?1\s?\d{10}$/, prefix: '+1' },
  { code: 'CN', name: 'China', pattern: /^\+?86\s?\d{11}$/, prefix: '+86' },
  { code: 'DE', name: 'Germany', pattern: /^\+?49\s?\d{10,11}$/, prefix: '+49' },
  { code: 'FR', name: 'France', pattern: /^\+?33\s?\d{9}$/, prefix: '+33' },
  { code: 'IN', name: 'India', pattern: /^\+?91\s?\d{10}$/, prefix: '+91' },
  { code: 'ID', name: 'Indonesia', pattern: /^\+?62\s?\d{10,12}$/, prefix: '+62' },
  { code: 'IT', name: 'Italy', pattern: /^\+?39\s?\d{10}$/, prefix: '+39' },
  { code: 'JP', name: 'Japan', pattern: /^\+?81\s?\d{10}$/, prefix: '+81' },
  { code: 'MY', name: 'Malaysia', pattern: /^\+?60\s?\d{9,10}$/, prefix: '+60' },
  { code: 'SG', name: 'Singapore', pattern: /^\+?65\s?\d{8}$/, prefix: '+65' },
  { code: 'KR', name: 'South Korea', pattern: /^\+?82\s?\d{9,10}$/, prefix: '+82' },
  { code: 'TH', name: 'Thailand', pattern: /^\+?66\s?\d{9}$/, prefix: '+66' },
  { code: 'VN', name: 'Vietnam', pattern: /^\+?84\s?\d{9,10}$/, prefix: '+84' },
];

export const validatePhoneNumber = (number: string, format: string): boolean => {
  const country = COUNTRIES.find(c => c.code === format);
  return country?.pattern.test(number) || false;
};
