export interface BaseballTeam {
  id: string;
  name: string;
  ageGroup: string;
  type: 'travel' | 'rec' | 'select';
  headCoach: string;
  maxRoster: number;
  seasonStart?: string;
  seasonEnd?: string;
  practiceDays?: string[];
  practiceTime?: string;
  practiceEndTime?: string;
  practiceLocation?: string;
  fee?: number;
  paymentType?: 'one-time' | 'monthly' | 'per-season';
}

export interface BaseballRegistrationField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface BaseballMessageChannel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface BaseballOnboardingData {
  // Org Info
  orgName: string;
  orgType: 'club' | 'league' | 'academy';
  description: string;
  phone: string;
  website: string;
  league: string;

  // Location
  address: string;
  city: string;
  state: string;
  zip: string;
  fieldName: string;
  fieldCount: number;
  hasBattingCages: boolean;
  hasBullpens: boolean;

  // Teams
  teams: BaseballTeam[];

  // Features
  selectedFeatures: string[];

  // Website
  hasExistingWebsite: boolean;
  existingWebsiteUrl: string;

  // Schedule
  seasonType: 'spring' | 'summer' | 'fall' | 'year-round';

  // Messaging
  enableDirectMessages: boolean;
  enableEmailNotifications: boolean;
  messageChannels: BaseballMessageChannel[];

  // Registration
  registrationFields: BaseballRegistrationField[];

  // Merch
  merchSetupType: 'existing' | 'shopify' | 'none';
  existingMerchStoreName: string;
  existingMerchStoreUrl: string;

  // Branding
  primaryColor: string;
  secondaryColor: string;
}

export const AGE_GROUPS = ['6U', '8U', '10U', '12U', '14U', '16U', '18U', 'Adult'] as const;

export const POSITIONS = [
  'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Shortstop',
  'Third Base', 'Left Field', 'Center Field', 'Right Field', 'Utility',
] as const;

export const defaultBaseballOnboardingData: BaseballOnboardingData = {
  orgName: '',
  orgType: 'club',
  description: '',
  phone: '',
  website: '',
  league: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  fieldName: '',
  fieldCount: 1,
  hasBattingCages: false,
  hasBullpens: false,
  teams: [],
  selectedFeatures: [],
  hasExistingWebsite: false,
  existingWebsiteUrl: '',
  seasonType: 'spring',
  enableDirectMessages: true,
  enableEmailNotifications: true,
  messageChannels: [
    { id: '1', name: 'announcements', description: 'Organization-wide announcements', isPrivate: false },
    { id: '2', name: 'general', description: 'General discussion', isPrivate: false },
  ],
  registrationFields: [
    { id: '1', label: 'Age', type: 'number', required: true },
    { id: '2', label: 'Grade', type: 'select', required: true, options: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    { id: '3', label: 'Primary Position', type: 'select', required: true, options: ['Pitcher', 'Catcher', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF', 'Utility'] },
    { id: '4', label: 'Secondary Position', type: 'select', required: false, options: ['Pitcher', 'Catcher', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF', 'Utility'] },
    { id: '5', label: 'Bats', type: 'select', required: true, options: ['Right', 'Left', 'Switch'] },
    { id: '6', label: 'Throws', type: 'select', required: true, options: ['Right', 'Left'] },
    { id: '7', label: 'Previous Team/League', type: 'text', required: false },
  ],
  merchSetupType: 'none',
  existingMerchStoreName: '',
  existingMerchStoreUrl: '',
  primaryColor: '#1a5e3a',
  secondaryColor: '#f5f0e1',
};

export const BASEBALL_FEATURE_OPTIONS = [
  { id: 'website', label: 'Team Website', description: 'Create or link your organization website', icon: 'Globe' },
  { id: 'schedule', label: 'Game Schedule', description: 'Manage games, practices, and tournaments', icon: 'Calendar' },
  { id: 'messaging', label: 'Messaging', description: 'Communicate with parents and coaches', icon: 'MessageSquare' },
  { id: 'payments', label: 'Payments', description: 'Collect fees, dues, and fundraising', icon: 'CreditCard' },
  { id: 'registration', label: 'Registration', description: 'Online player registration and tryouts', icon: 'ClipboardList' },
  { id: 'merch', label: 'Team Store', description: 'Sell team gear, uniforms, and equipment', icon: 'ShoppingBag' },
] as const;
