# Plant Tracker 🌱

A personal plant tracking application for managing plants from seed to maturity, with NFC tag support for physical labeling.

## Features

- **Plant Management**: Track plants through their entire lifecycle (seed → sprouted → seedling → growing → mature → harvest)
- **Garden Grid System**: Visual grid-based location tracking for garden beds
- **Multi-User Support**: Email-based authentication with workspace sharing
- **NFC Tag Integration**: Link physical NFC tags to plants for quick access
- **Photo Timeline**: Document plant growth with photos
- **Fun Plant Names**: Automatic pun-based name suggestions (Basil Fawlty, Tomato Cruise, etc.)
- **Mobile-First**: Optimized for phone access on local network

## Quick Start

### Prerequisites

- Node.js 18+ 
- Docker (for PostgreSQL database)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/planttracker.git
cd planttracker/app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure `.env.local`:
```env
# Database - Use PostgreSQL with Docker
DATABASE_URL="postgresql://planttracker:planttracker@localhost:5432/planttracker"

# Authentication (required for multi-user)
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_TRUST_HOST="true"

# Email provider (Resend.com recommended)
AUTH_RESEND_KEY="re_xxxxx"  # Get from https://resend.com
EMAIL_FROM="noreply@yourdomain.com"
```

5. Start the database:
```bash
npm run db:start  # Starts PostgreSQL in Docker
```

6. Initialize the database:
```bash
npm run db:push   # Create tables from Prisma schema
```

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000)

## Local Network Access

To access from your phone:

1. Find your computer's IP address:
   - Mac: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig`
   - Linux: `ip addr show`

2. On your phone, navigate to: `http://[your-ip]:3000`
   - Example: `http://192.168.1.100:3000`

## NFC Tag Setup

1. Get NFC tags (NTAG213/215/216 recommended)
2. Install an NFC writing app on your phone:
   - Android: "NFC Tools" or "TagWriter"
   - iPhone: "NFC Tools for iPhone"
3. For each plant:
   - Go to the plant's detail page
   - Find the NFC UUID in the tag management section
   - Write URL to tag: `https://yourdomain.com/nfc/[uuid]`
   - Link the tag to the plant using the UUID

## Database Management

```bash
# Start PostgreSQL
npm run db:start

# Stop PostgreSQL  
npm run db:stop

# View/edit database
npm run db:studio   # Opens Prisma Studio at localhost:5555

# Update schema
npm run db:push     # Development: push schema changes
```

## Project Structure

```
app/
├── app/                  # Next.js App Router pages
│   ├── api/             # API endpoints
│   ├── auth/            # Authentication pages
│   ├── gardens/         # Garden management
│   ├── plants/          # Plant pages
│   └── nfc/            # NFC tag routing
├── components/          # React components
│   ├── gardens/        # Garden-specific components
│   └── plants/         # Plant-specific components
├── lib/                # Utilities and services
│   ├── db.ts          # Prisma client
│   ├── plant-names.ts # Fun name generator
│   └── plant-status.ts # Status definitions
├── prisma/
│   └── schema.prisma   # Database schema
└── public/            # Static assets
```

## Authentication Setup

The app uses NextAuth v5 with Resend for email authentication:

1. Sign up for [Resend](https://resend.com) (free tier available)
2. Get your API key from the Resend dashboard
3. Add to `.env.local`:
   ```env
   AUTH_RESEND_KEY="re_xxxxx"
   EMAIL_FROM="plants@yourdomain.com"
   ```
4. Users will receive magic links to sign in

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `DATABASE_URL` (use Neon or Vercel Postgres)
   - `AUTH_SECRET`
   - `AUTH_RESEND_KEY`
   - `EMAIL_FROM`
4. Deploy

### Self-Hosting

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   npm start
   ```

## Troubleshooting

### Database Connection Issues
- Ensure Docker is running: `docker ps`
- Check PostgreSQL logs: `docker compose logs postgres`
- Verify DATABASE_URL in `.env.local`

### Authentication Not Working
- Ensure AUTH_SECRET is set (generate with `openssl rand -base64 32`)
- Check Resend API key is valid
- Verify EMAIL_FROM domain is verified in Resend

### NFC Tags Not Working
- Ensure HTTPS in production (required for NFC)
- Check tag UUID format matches
- Verify tag is properly linked to plant

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run db:studio  # Open Prisma Studio
```

## Contributing

Pull requests welcome! Please follow the existing code style and add tests for new features.

## License

MIT