import { UIConfig } from '../types/ui';

// Platform-specific configurations
export const UI_CONFIGS: Record<string, UIConfig> = {
  gpt: {
    platform: 'gpt',
    displayMode: 'text',
    features: {
      buttons: false,
      richText: false,
      images: false,
      animations: false,
      quickActions: false,
      voiceInput: false,
    },
  },
  
  web: {
    platform: 'web',
    displayMode: 'buttons',
    features: {
      buttons: true,
      richText: true,
      images: true,
      animations: true,
      quickActions: true,
      voiceInput: false,
    },
  },
  
  mobile: {
    platform: 'mobile',
    displayMode: 'hybrid',
    features: {
      buttons: true,
      richText: true,
      images: true,
      animations: false, // Battery saving
      quickActions: true,
      voiceInput: true,
    },
  },
};

// Detect platform from environment or user agent
export function detectPlatform(): 'gpt' | 'web' | 'mobile' {
  // Check environment variable first
  if (typeof window !== 'undefined' && (window as any).PLATFORM) {
    return (window as any).PLATFORM;
  }
  
  // Check localStorage for manual override
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('platform_override');
    if (override && ['gpt', 'web', 'mobile'].includes(override)) {
      return override as any;
    }
    
    // Check user agent for mobile
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) {
      return 'mobile';
    }
    
    return 'web';
  }
  
  // Default to web
  return 'web';
}

// Get current configuration
export function getCurrentConfig(): UIConfig {
  const platform = detectPlatform();
  return UI_CONFIGS[platform];
}

// Override platform (for testing)
export function setPlatformOverride(platform: 'gpt' | 'web' | 'mobile' | null) {
  if (typeof window !== 'undefined') {
    if (platform) {
      localStorage.setItem('platform_override', platform);
    } else {
      localStorage.removeItem('platform_override');
    }
    // Reload to apply changes
    window.location.reload();
  }
}

