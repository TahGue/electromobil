# Mobile Repair Shop

A modern, full-stack mobile repair shop website built with Next.js 14, TypeScript, and Prisma.

## Features

- Online booking system
- Admin dashboard for managing bookings and services
- Service catalog with pricing
- Contact form
- Business hours and location display
- Modern, responsive UI with animations

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- MariaDB
- Framer Motion
- NextAuth.js
- React Hook Form

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/repair_shop"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Email
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"

   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Push schema to database:
   ```bash
   npx prisma db push
   ```

6. Seed the database:
   ```bash
   npx prisma db seed
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
mobile-repair-shop/
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── services/        # Services pages
│   ├── booking/         # Booking system
│   ├── admin/           # Admin dashboard
│   └── (auth)/          # Authentication
├── components/          # Reusable components
│   ├── ui/             # UI components
│   ├── forms/          # Form components
│   └── admin/          # Admin components
├── lib/                 # Utility functions
│   ├── prisma.ts       # Prisma client
│   ├── auth.ts         # Authentication
│   └── utils.ts        # Helper functions
├── types/              # TypeScript types
└── prisma/            # Prisma schema and migrations
```

## Development

The project uses TypeScript for type safety and Tailwind CSS for styling. All components are built with React and follow a component-based architecture.

## Deployment

The application can be deployed to any platform that supports Node.js applications. Recommended platforms include Vercel or Netlify.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
