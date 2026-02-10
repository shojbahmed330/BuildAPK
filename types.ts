
export enum AppMode {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
  SHOP = 'SHOP',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN'
}

export interface GithubConfig {
  token: string;
  repo: string;
  owner: string;
}

export interface ChoiceOption {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  inputType?: 'single' | 'multiple' | 'text';
  options?: ChoiceOption[];
  choices?: { label: string; prompt: string }[];
  files?: Record<string, string>;
}

export interface Package {
  id: string;
  name: string;
  tokens: number;
  price: number;
  color: string;
  icon: string;
  is_popular: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  package_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  payment_method: string;
  trx_id: string;
  screenshot_url?: string;
  message?: string;
  created_at: string;
  user_email?: string;
}

export interface ActivityLog {
  id: string;
  admin_email: string;
  action: string;
  details: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  tokens: number;
  isLoggedIn: boolean;
  joinedAt: number;
  isAdmin?: boolean;
  is_banned?: boolean;
  bio?: string;
  github_token?: string;
  github_owner?: string;
  github_repo?: string;
  is_verified?: boolean;
}
