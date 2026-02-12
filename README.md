# Visheshkala Studio 🎨

Visheshkala (by Vishakha Garg) is a digital gallery and admin studio for handmade miniatures, custom clay art, and fine art pieces.

## 🚀 Features
- **Narrative Storytelling**: A Ghibli-inspired "About" section that takes users through a creative journey.
- **Dynamic Gallery**: Categorized showcase of Mandalas, Miniatures, Gifts, and DIY art.
- **Secure Admin Dashboard**: A private portal to manage artworks, uploads, and descriptions.
- **Secure Reset Flow**: Token-based password reset system with email integration.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Framer Motion, Tailwind CSS.
- **Backend/API**: Vercel Serverless Functions (Node.js).
- **Database**: Supabase (PostgreSQL + RLS).
- **Email**: Resend.

## 🔒 Security & Performance
- **Row Level Security (RLS)**: Database tables are protected; administrative actions are isolated to server-side functions.
- **JWT Authentication**: Secure, cookie-based session management for the admin.
- **Responsive Design**: Optimized for everything from mobile phones up to high-definition desktops.

## 📦 Getting Started

### Local Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. **Note**: For API functionality locally, use `vercel dev`.

### Environment Variables
Ensure the following are set in your `.env` (local) or Vercel (production):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `RESEND_API_KEY`

---
*Matchless offerings, from us to you.*
