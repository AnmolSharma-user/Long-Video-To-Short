# VideoShorts.AI 🎥

An AI-powered video processing platform that automatically converts long-form videos into engaging short clips.

## Features 🚀

- 🤖 AI-powered video processing
- 🎬 Automatic clip generation
- 📝 Automatic captions
- 🎵 Background music integration
- 🔗 YouTube video import
- 💳 Credit-based system
- 🔐 Secure authentication
- 💰 Stripe payment integration

## Tech Stack 💻

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- NextAuth.js
- Stripe
- FFmpeg
- ShadcnUI

## Prerequisites 📋

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## Environment Variables 🔑

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXTAUTH_URL`: Your app URL
- `NEXTAUTH_SECRET`: Random string for session encryption
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret

## Installation 🛠️

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-shorts-ai.git
cd video-shorts-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup 🗄️

1. Create a new Supabase project
2. Run the migration scripts in `supabase/migrations`
3. Update your environment variables with the Supabase credentials

## Payment Setup 💳

1. Create a Stripe account
2. Add your Stripe keys to the environment variables
3. Set up the Stripe webhook endpoint
4. Configure your pricing plans in `src/lib/constants/pricing.ts`

## Authentication Setup 🔐

1. Configure NextAuth.js in `src/app/api/auth/[...nextauth]/route.ts`
2. Set up your OAuth providers (Google, GitHub)
3. Add the provider credentials to your environment variables

## Development 👩‍💻

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript checks

## Production Deployment 🚀

1. Set up your production environment variables
2. Build the application:
```bash
npm run build
```

3. Start the production server:
```bash
npm run start
```

## Contributing 🤝

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License 📄

MIT License - see LICENSE file for details

## Support 💬

For support, email support@videoshortsai.com or join our Discord community.