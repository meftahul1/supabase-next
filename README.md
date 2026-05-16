<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <h1 align="center">Next.js Supabase Dashboard</h1>
</a>

<p align="center">
 A full-stack Next.js application featuring authentication, OAuth, and a real-time task management system powered by Supabase.
</p>

## Application Overview

### Authentication
This application includes a complete authentication system powered by Supabase Auth:
- **Email & Password**: Secure standard sign-up and sign-in functionality with password recovery.
- **OAuth Integration**: One-click social logins supported via **Google** and **Outlook (Azure)**.
- **Protected Routes**: Next.js Middleware and server-side session validation ensure that the dashboard and task manager are only accessible to logged-in users.

### Task Manager
Authenticated users get access to a robust Task Manager featuring:
- **Full CRUD functionality**: Users can seamlessly create, read, update, and mark their tasks as completed.
- **Image Uploads**: Each task supports image attachments, securely stored and served via Supabase Storage buckets.
- **Real-time Subscriptions**: New tasks appear instantly in the UI without a page reload thanks to Supabase's Postgres real-time channels.
- **Data Privacy**: Client-side filtering combined with Postgres Row Level Security (RLS) guarantees that users can only view, edit, and delete their own tasks and images.

---

## Setup and Run Locally

Follow these steps to set up the project on your local machine.

### 1. Configure Supabase

1. Create a new [Supabase project](https://database.new) in your dashboard.
2. Go to the **SQL Editor** or **Table Editor** and create a `tasks` table with the following columns:
   - `id` (int8, primary key, identity/auto-incrementing)
   - `title` (text)
   - `description` (text)
   - `created_at` (timestamp, default `now()`)
   - `image_url` (text)
   - `email` (text)
3. Go to **Database > Publications** and enable Realtime for the `tasks` table.
4. Go to **Storage** and create a public bucket named `tasks-images`.
5. Set up **Row Level Security (RLS)** on both the `tasks` table and `tasks-images` bucket to restrict CRUD access to authenticated users.

### 2. Configure Environment Variables

Rename the provided `.env.example` file to `.env.local`:

```bash
mv .env.example .env.local
```

Populate `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```
*(You can find these values under **Project Settings > API** in your Supabase dashboard).*

### 3. Install and Run

Install dependencies and start the Next.js development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can now sign up, log in (via Email, Google, or Outlook), and start managing your tasks!

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Database, Auth & Storage**: [Supabase](https://supabase.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)tjs)
