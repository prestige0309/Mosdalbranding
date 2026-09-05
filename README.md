## Supabase setup (required — do this first)

This app now stores everything (portfolio, testimonials, quote requests,
orders, and the admin login) in a real Supabase database instead of the
browser's localStorage. Nothing will load or save until you connect a
Supabase project:

1. **Create a project** at [supabase.com](https://supabase.com) (the free
   tier is enough).
2. **Run the schema.** Dashboard → SQL Editor → New query → paste the full
   contents of [`supabase/schema.sql`](./supabase/schema.sql) → Run. This
   creates the four tables, locks them down with Row Level Security, sets
   up the public `portfolio-images` storage bucket, and seeds the site with
   the original demo portfolio/testimonial content.
3. **Create the admin account.** Dashboard → Authentication → Users → Add
   user → enter an email (e.g. `admin@mosdal.com`) and a password. This
   replaces the old hardcoded `mosdal2026` password — only this account can
   sign into `/admin`.
4. **Copy your API keys.** Dashboard → Project Settings → API → copy the
   "Project URL" and the `anon` "public" key.
5. **Set your environment variables.** Copy `.env.example` to `.env` and
   fill in:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_EMAIL=admin@mosdal.com   # the email you used in step 3
   ```
6. `npm install` (Supabase's client library is already in `package.json`),
   then `npm run dev`.

The admin login screen still only asks for a password — `VITE_ADMIN_EMAIL`
tells Supabase which account that password belongs to. Every portfolio
add/edit/delete, quote request, order, and testimonial approval now goes
through Supabase's database with Row Level Security, so:
- Site visitors can submit quotes, orders, and testimonials, and can read
  the public portfolio and approved reviews.
- Only someone signed in as the admin can see quote/order details, approve
  or reject testimonials, and add/edit/remove portfolio items (including
  uploading images, which now go to Supabase Storage instead of being
  base64-encoded into localStorage).

# Welcome to your OnSpace project

## How can I edit this code?

There are several ways of editing your application.

**Use OnSpace**

Simply visit the [OnSpace Project]() and start prompting.

Changes made via OnSpace will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in OnSpace.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [OnSpace]() and click on Share -> Publish.
# Mosdalbranding
