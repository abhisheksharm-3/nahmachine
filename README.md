# NahMachine

A creative way to say "no" powered by AI. This project combines Google's Gemini API with the [No as a Service API](https://naas.isalman.dev/no) by [hotheadhacker](https://github.com/hotheadhacker) to generate witty, polite, and unique ways to decline requests.

Try it live at: [nahmachine.vercel.app](https://nahmachine.vercel.app)

## Features

- Generate AI-powered creative ways to say "no"
- Save your favorite responses
- Dark/Light mode support
- Modern, responsive UI built with Next.js and TailwindCSS
- Secure server-side API handling

## Getting Started

First, set up your environment variables:

1. Create a `.env.local` file in the root directory
2. Add your Gemini API key:
```bash
GEMINI_API_KEY=your_api_key_here
```

Then, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Google Gemini API](https://ai.google.dev/) - AI content generation
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## Credits

Special thanks to:
- [hotheadhacker](https://github.com/hotheadhacker) for creating and providing the [No as a Service API](https://github.com/hotheadhacker/no-as-a-service) that this project relies on
- [Google Gemini](https://ai.google.dev/) team for providing the powerful AI API
- [Vercel](https://vercel.com) and the Next.js team for the amazing development framework
- [TailwindCSS](https://tailwindcss.com) team for the utility-first CSS framework

## License

This project is open source and available under the MIT license.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
