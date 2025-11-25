import { getCurrentConfig } from './ui.config';

// Get current config
const config = getCurrentConfig();

// Feature flags based on platform
export const FEATURE_FLAGS = {
  // UI Features
  ENABLE_BUTTONS: config.features.buttons,
  ENABLE_QUICK_ACTIONS: config.features.quickActions,
  ENABLE_ANIMATIONS: config.features.animations,
  ENABLE_IMAGES: config.features.images,
  ENABLE_RICH_TEXT: config.features.richText,
  
  // Functional Features
  ENABLE_ORDER_TRACKING: true,
  ENABLE_FAVORITES: false, // Coming soon
  ENABLE_VOICE_INPUT: config.features.voiceInput,
  
  // Display Options
  MAX_OPTIONS_DISPLAYED: config.platform === 'gpt' ? 5 : 10,
  SHOW_EMOJIS: true,
  SHOW_PRICES_INLINE: true,
  
  // Platform-specific
  IS_GPT: config.platform === 'gpt',
  IS_WEB: config.platform === 'web',
  IS_MOBILE: config.platform === 'mobile',
};

// Export config for components
export { config as UI_CONFIG };

