# Agent Zero

An interactive booth demo for Webrix at AI Dev TLV conference. "How fast can you bring prod down?" - Visitors play through a gamified experience that demonstrates the dangers of unguarded AI agents and how Webrix solves this with identity and access management for AI.

## Features

- **Retro Gaming Aesthetic**: Commander Keen / early 90s DOS game style with pixel art, EGA colors, scanlines, and retro gaming UI patterns
- **Interactive Chat Experience**: AI-powered conversations using Claude via Vercel AI SDK
- **Email Enrichment**: Automatic lead enrichment from work email addresses
- **Gamified Flow**: Progress through phases - Recon → Boss Battle → Security Alert → Showcase → Victory
- **Prompt Injection Challenge**: Visitors attempt to "hack" DevBot via prompt injection
- **Lead Capture**: Full session tracking and analytics via Supabase
- **Email Follow-up**: Automated completion emails with giveaway codes via Resend

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + custom retro theme |
| AI Chat | Vercel AI SDK + Anthropic Claude |
| Database | Supabase (Postgres) |
| Email | Resend |
| Hosting | Vercel |
| Fonts | Press Start 2P (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key
- Resend account

### Installation

1. Clone the repository and navigate to the project:

```bash
cd operation-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Email address to send from
- `NEXT_PUBLIC_LINKEDIN_URL` - Webrix LinkedIn company URL

4. Set up Supabase:

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create the required tables.

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
operation-mcp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts        # AI chat endpoint
│   │   │   ├── enrich/route.ts      # Email enrichment
│   │   │   ├── session/route.ts     # Session management
│   │   │   └── complete/route.ts    # Completion email
│   │   ├── globals.css              # Global styles + retro theme
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Main game component
│   ├── components/
│   │   ├── SplashScreen.tsx         # Title screen with email input
│   │   ├── GameContainer.tsx        # CRT effects wrapper
│   │   ├── ChatInterface.tsx        # Chat UI
│   │   ├── Message.tsx              # Individual message bubble
│   │   ├── OptionButtons.tsx        # Multiple choice responses
│   │   ├── VictoryScreen.tsx        # Giveaway screen
│   │   └── PixelLogo.tsx            # Webrix logo
│   └── lib/
│       ├── supabase.ts              # Supabase client
│       ├── prompts.ts               # System prompts
│       ├── constants.ts             # Game constants
│       └── utils.ts                 # Helper functions
├── public/
│   └── images/                      # Logo assets
├── supabase-schema.sql              # Database schema
└── package.json
```

## Game Flow

1. **Splash Screen**: Visitor enters work email
2. **Recon Phase**: Quick survey about AI tools, MCPs, and approval processes
3. **Boss Battle**: Prompt injection challenge - visitor tries to hack DevBot
4. **Security Alert**: Webrix "saves the day" by blocking the attack
5. **Showcase**: Demo of Webrix MCP approval and deployment features
6. **Victory**: Giveaway code displayed, LinkedIn follow CTA

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables on Vercel

- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_LINKEDIN_URL`

## License

MIT
