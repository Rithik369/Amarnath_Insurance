// Edit this file to update business details shown on the website.
export const SITE = {
  name: 'RML Insurances',
  tagline: 'Insurance Advisory',
  advisor: 'Amarnath',
  phones: ['9442644761', '9597421570'],
  whatsapp: '919442644761',
  email: 'rmlinsurances@gmail.com',
  mapLink: 'https://maps.app.goo.gl/63xM3fPCraVtc4MX8',
};

export type InsuranceType = 'Health' | 'Term Life' | 'Motor';

export const SERVICES: {
  type: InsuranceType;
  icon: string;
  partner: string;
  headline: string;
  points: string[];
}[] = [
  {
    type: 'Health',
    icon: '🩺',
    partner: 'HDFC ERGO',
    headline: 'Cashless hospital care for you and your family.',
    points: [
      'Individual & family floater plans',
      'Cashless treatment at network hospitals',
      'Help choosing the right sum insured',
      'Full support during claims',
    ],
  },
  {
    type: 'Term Life',
    icon: '🛡️',
    partner: 'Axis Max Life & HDFC Life',
    headline: 'High cover at a low premium to protect your family’s future.',
    points: [
      'Cover chosen to match your income & loans',
      'Compare plans from two trusted insurers',
      'Simple guidance on riders & add-ons',
      'Easy nominee & claim assistance',
    ],
  },
  {
    type: 'Motor',
    icon: '🚗',
    partner: 'New India Assurance',
    headline: 'Car and two-wheeler insurance with easy renewals.',
    points: [
      'Comprehensive & third-party plans',
      'Quick renewal reminders',
      'No-claim bonus guidance',
      'Support when you make a claim',
    ],
  },
];

export const PARTNERS = ['HDFC ERGO', 'Axis Max Life', 'HDFC Life', 'New India Assurance'];

export const STATS = [
  { value: 3, suffix: '', label: 'Insurance types' },
  { value: 4, suffix: '', label: 'Trusted insurers' },
  { value: 0, prefix: '₹', suffix: '', label: 'Advice fee' },
  { value: 1, suffix: '-to-1', label: 'Personal advisor' },
];

export const CLAIM_DOCS: Record<InsuranceType, string[]> = {
  Health: [
    'Policy copy / health e-card',
    'Photo ID of patient (Aadhaar / PAN)',
    'Filled & signed claim form',
    'Hospital discharge summary',
    'Final hospital bill & payment receipts',
    'Doctor prescriptions & test reports',
    'Pharmacy bills',
    'Cancelled cheque / bank details',
  ],
  'Term Life': [
    'Original policy document',
    'Death certificate',
    'Nominee photo ID & address proof',
    'Filled & signed claim form',
    'Medical records / hospital certificate',
    'FIR & post-mortem report (if accidental)',
    'Cancelled cheque of nominee',
  ],
  Motor: [
    'Policy copy',
    'Vehicle RC (registration certificate)',
    'Driving licence',
    'Filled & signed claim form',
    'Photos of the damage',
    'Repair estimate & final invoice',
    'FIR (for theft or major accident)',
    'Cancelled cheque / bank details',
  ],
};

export const STEPS = [
  { icon: '📞', title: 'Call or WhatsApp', text: 'Share your needs or your existing policy.' },
  { icon: '🔍', title: 'We explain clearly', text: 'Your options, in simple words.' },
  { icon: '✅', title: 'You decide', text: 'No pressure, no obligation.' },
];

export const FAQS = [
  {
    q: 'Is the policy review really free?',
    a: 'Yes. We explain your existing policy at no charge, and you are under no obligation to buy anything.',
  },
  {
    q: 'Which insurance companies do you work with?',
    a: 'Health: HDFC ERGO. Term Life: Axis Max Life and HDFC Life. Motor: New India Assurance.',
  },
  {
    q: 'Will you help me when I make a claim?',
    a: 'Absolutely. We guide you through documents and follow up with the insurer until your claim is settled.',
  },
  {
    q: 'How do I get started?',
    a: 'Fill the quick quote form, call us, or message us on WhatsApp. We usually reply the same day.',
  },
];
