# NahMachine Reasons Library

This directory contains organized collections of creative ways to say "no" for the NahMachine app.

## 📁 Structure

```
src/lib/reasons/
├── index.ts          # Main exports and types
├── lazy.ts           # Lazy/unmotivated reasons
├── sarcastic.ts      # Witty/sassy reasons  
├── creative.ts       # Quirky/imaginative reasons
├── relatable.ts      # Everyday relatable reasons
└── README.md         # This file
```

## 🚀 How to Add New Reasons

### 1. Add to Existing Category

Simply add new strings to any of the existing arrays:

```typescript
// In lazy.ts
export const lazyReasons = [
  // ... existing reasons
  "Your new lazy reason here",
];
```

### 2. Create New Category

1. Create a new file (e.g., `professional.ts`):

```typescript
export const professionalReasons = [
  "I have a conflict in my calendar.",
  "I'm not available during that timeframe.",
  // ... more professional reasons
];
```

2. Update `index.ts`:

```typescript
import { professionalReasons } from './professional';

export type ReasonCategory = 'lazy' | 'sarcastic' | 'creative' | 'relatable' | 'professional' | 'random';

export const reasonCategories = {
  lazy: lazyReasons,
  sarcastic: sarcasticReasons,
  creative: creativeReasons,
  relatable: relatedReasons,
  professional: professionalReasons, // Add here
} as const;

// Export the new category
export { professionalReasons };
```

3. The new category will automatically be available in the server actions!

## 📊 Current Categories

- **lazy**: For when you're feeling unmotivated (~20 reasons)
- **sarcastic**: For witty, sassy responses (~20 reasons)  
- **creative**: For quirky, imaginative excuses (~20 reasons)
- **relatable**: For everyday situations (~20 reasons)

## 🎯 Guidelines for New Reasons

1. **Keep it concise**: 5-25 words per reason
2. **Make it memorable**: Funny, relatable, or clever
3. **Stay appropriate**: Avoid offensive content
4. **Be original**: Check for duplicates across categories
5. **Match the category vibe**: 
   - Lazy: Low effort, couch-related, procrastination
   - Sarcastic: Witty, eye-rolling, slightly attitude
   - Creative: Absurd, imaginative, unexpected
   - Relatable: Real-life situations, common feelings

## 🔄 Auto-Deduplication

The system automatically removes duplicates when combining all categories, so don't worry about overlap between files.

## 🧪 Testing New Reasons

After adding reasons, test them:

```typescript
// In your component or test
import { getNoReasonByCategory } from '@/app/actions';

const result = await getNoReasonByCategory('your-new-category');
console.log(result.message);
```

## 📈 Scaling Tips

- Keep each category file under 50 reasons for maintainability
- Consider creating themed subcategories (e.g., `work.ts`, `social.ts`)
- Use descriptive variable names
- Add JSDoc comments for complex categories
- Consider internationalization for global reach

---

Happy reason writing! 🎭
