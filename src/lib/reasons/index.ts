import { lazyReasons } from './lazy';
import { sarcasticReasons } from './sarcastic';
import { creativeReasons } from './creative';
import { relatedReasons } from './relatable';
// import { professionalReasons } from './professional'; // Uncomment to enable

export type ReasonCategory = 'lazy' | 'sarcastic' | 'creative' | 'relatable' | 'random';
// To add professional category, update the type above to:
// export type ReasonCategory = 'lazy' | 'sarcastic' | 'creative' | 'relatable' | 'professional' | 'random';

export const reasonCategories = {
  lazy: lazyReasons,
  sarcastic: sarcasticReasons,
  creative: creativeReasons,
  relatable: relatedReasons,
  // professional: professionalReasons, // Uncomment to enable
} as const;

// Combined array for random selection
export const allReasons = [
  ...lazyReasons,
  ...sarcasticReasons,
  ...creativeReasons,
  ...relatedReasons,
  // ...professionalReasons, // Uncomment to enable
];

// Remove duplicates
export const uniqueReasons = Array.from(new Set(allReasons));

export { lazyReasons, sarcasticReasons, creativeReasons, relatedReasons };
// export { professionalReasons }; // Uncomment to enable
