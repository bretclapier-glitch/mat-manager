export interface Program {
  id: string;
  name: string;
  description: string;
  seasonStart?: string;
  seasonEnd?: string;
  practiceDays?: string[];
  practiceTime?: string;
  practiceEndTime?: string;
  competitions?: Competition[];
  price?: number;
  paymentType?: 'one-time' | 'monthly';
}

export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
}

export interface RegistrationField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface OnboardingData {
  // Club Info
  description: string;
  phone: string;
  website: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Programs
  programs: Program[];
  
  // Features
  selectedFeatures: string[];
  
  // Website
  hasExistingWebsite: boolean;
  existingWebsiteUrl: string;
  
  // Registration
  registrationFields: RegistrationField[];
  
  // Branding
  primaryColor: string;
  secondaryColor: string;
}

export const defaultOnboardingData: OnboardingData = {
  description: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  programs: [],
  selectedFeatures: [],
  hasExistingWebsite: false,
  existingWebsiteUrl: '',
  registrationFields: [
    { id: '1', label: 'Age', type: 'number', required: true },
    { id: '2', label: 'Grade', type: 'select', required: true, options: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    { id: '3', label: 'Estimated Weight (lbs)', type: 'number', required: true },
    { id: '4', label: 'Experience Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Competitive'] },
    { id: '5', label: 'City/Town', type: 'text', required: false },
  ],
  primaryColor: '#d4a739',
  secondaryColor: '#1a1f36',
};

export const FEATURE_OPTIONS = [
  { id: 'website', label: 'Club Website', description: 'Create or link your club website', icon: 'Globe' },
  { id: 'schedule', label: 'Schedule', description: 'Manage practices and competitions', icon: 'Calendar' },
  { id: 'messaging', label: 'Messaging', description: 'Communicate with parents and athletes', icon: 'MessageSquare' },
  { id: 'payments', label: 'Payments', description: 'Collect fees and track payments', icon: 'CreditCard' },
  { id: 'registration', label: 'Registration', description: 'Online registration with waivers', icon: 'ClipboardList' },
  { id: 'merch', label: 'Merch Store', description: 'Sell club gear and apparel', icon: 'ShoppingBag' },
] as const;
