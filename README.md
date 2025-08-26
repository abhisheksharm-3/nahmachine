# NahMachine

A creative way to say "no" with style! This project features a comprehensive collection of witty, sarcastic, lazy, and relatable ways to decline requests. Built with Next.js server actions and enhanced with AI-powered custom responses using Google's Gemini API.

Try it live at: [nahmachine.vercel.app](https://nahmachine.vercel.app)

## ✨ Features

- **80+ Creative Reasons**: Curated collection across multiple categories
- **AI-Powered Generation**: Custom responses based on your favorites using Gemini API
- **Category-Based Responses**: Lazy, sarcastic, creative, and relatable themes
- **Bulk Generation**: Get multiple reasons at once
- **Save Favorites**: Keep track of your preferred responses
- **Dark/Light Mode**: Modern theme switching
- **Fully Self-Hosted**: No external API dependencies for core functionality
- **Scalable Architecture**: Easy to add new categories and reasons
- **Type-Safe**: Built with TypeScript for reliability

## 🎯 Available Categories

- **`lazy`**: For those couch-potato moments
  - *"I'm in a committed relationship with my couch."*
  - *"Sorry, I'm practicing the ancient art of doing nothing."*

- **`sarcastic`**: For witty, eye-rolling responses
  - *"Sorry, my calendar is booked with absolutely nothing."*
  - *"I'd rather explain TikTok to my grandmother."*

- **`creative`**: For quirky, imaginative excuses
  - *"My pet rock said it's a bad idea."*
  - *"Nah, Mercury is in microwave again."*

- **`relatable`**: For everyday, realistic situations
  - *"My social battery died and the charger is broken."*
  - *"I'd love to, but I'm busy pretending to be a functional adult."*

- **`random`**: Mix of all categories for variety

## 🚀 Server Actions

The app includes powerful Next.js server actions:

```typescript
// Get a single random reason
const reason = await getNoReason();

// Get multiple reasons at once (up to 10)
const reasons = await getMultipleNoReasons(5);

// Get category-specific reason
const lazyReason = await getNoReasonByCategory('lazy');

// Get statistics about available reasons
const stats = await getReasonStats();

// Get all available categories
const categories = await getAvailableCategories();
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ or Bun
- (Optional) Gemini API key for AI-generated custom responses

### Installation

1. Clone the repository:

```bash
git clone https://github.com/abhisheksharm-3/nahmachine.git
cd nahmachine
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. (Optional) Set up environment variables for AI features:

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/
│   ├── actions.ts          # Server actions for reason generation
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Main application page
├── components/
│   ├── ui/                 # Reusable UI components
│   └── theme-switcher.tsx  # Dark/light mode toggle
└── lib/
    ├── reasons/            # Organized reason collections
    │   ├── index.ts        # Main exports and types
    │   ├── lazy.ts         # Lazy/unmotivated reasons
    │   ├── sarcastic.ts    # Witty/sassy reasons
    │   ├── creative.ts     # Quirky/imaginative reasons
    │   ├── relatable.ts    # Everyday relatable reasons
    │   ├── professional.ts # Workplace-appropriate reasons
    │   ├── types.ts        # TypeScript interfaces
    │   └── README.md       # Documentation for adding reasons
    ├── gemini.ts           # AI integration utilities
    ├── store.ts            # Zustand state management
    └── utils.ts            # Utility functions
```

## 🔧 Adding New Reasons

The reason system is designed for easy scaling:

### Add to Existing Category

```typescript
// In src/lib/reasons/lazy.ts
export const lazyReasons = [
  // ... existing reasons
  "Your new lazy excuse here",
];
```

### Create New Category

1. Create `src/lib/reasons/romantic.ts`:

```typescript
export const romanticReasons = [
  "My heart belongs to someone else that day.",
  "I'm already committed to a date with myself.",
];
```

2. Update `src/lib/reasons/index.ts`:

```typescript
import { romanticReasons } from './romantic';

export type ReasonCategory = 'lazy' | 'sarcastic' | 'creative' | 'relatable' | 'romantic' | 'random';

export const reasonCategories = {
  // ... existing categories
  romantic: romanticReasons,
} as const;
```

See the [reasons README](src/lib/reasons/README.md) for detailed guidelines.

## 🎨 Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Google Gemini API](https://ai.google.dev/)** - AI content generation (optional)
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Lucide Icons](https://lucide.dev/)** - Consistent iconography

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app works on any platform supporting Node.js:
- Netlify
- Railway
- Render
- Self-hosted VPS

## 🤝 Contributing

Contributions are welcome! Here are some ways to help:

1. **Add more reasons**: Submit PRs with new creative excuses
2. **New categories**: Suggest themed reason collections
3. **UI improvements**: Enhance the user experience
4. **Bug fixes**: Report and fix issues
5. **Documentation**: Improve guides and examples

## 📊 Stats

- **80+ reasons** across 4 main categories
- **100% self-hosted** core functionality
- **Type-safe** with full TypeScript support
- **Zero external API dependencies** for basic features
- **Easily scalable** architecture

## 🙏 Credits

- **Original inspiration**: [No as a Service API](https://github.com/hotheadhacker/no-as-a-service) by [hotheadhacker](https://github.com/hotheadhacker)
- **AI Integration**: [Google Gemini](https://ai.google.dev/) team
- **Framework**: [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com)
- **Styling**: [TailwindCSS](https://tailwindcss.com) team
- **Icons**: [Lucide](https://lucide.dev/) contributors

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <strong>Built with ❤️ and a lot of creative procrastination</strong>
  <br>
  <em>Sometimes the best answer is just "nah" ✨</em>
</div>
