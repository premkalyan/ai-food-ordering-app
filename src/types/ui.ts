// UI Configuration Types
export type Platform = 'gpt' | 'web' | 'mobile';
export type DisplayMode = 'buttons' | 'text' | 'hybrid';

export interface UIConfig {
  platform: Platform;
  displayMode: DisplayMode;
  features: FeatureFlags;
}

export interface FeatureFlags {
  buttons: boolean;
  richText: boolean;
  images: boolean;
  animations: boolean;
  quickActions: boolean;
  voiceInput: boolean;
}

// Platform-agnostic response format
export interface ChatResponse {
  message: string;
  options: ResponseOption[];
  metadata?: {
    restaurants?: any[];
    menuItems?: any[];
    cart?: any[];
    order?: any;
  };
}

export interface ResponseOption {
  id: string;
  label: string;
  value: any;
  type: 'restaurant' | 'menu_item' | 'action';
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  description?: string;
}

