# She Can Foundation – Contact Form

This is a simple contact form I built for the She Can Foundation as part of a tech challenge. The idea was to create something clean and functional — a form where people can reach out, with all submissions saved to a database and viewable through a basic admin page.

## What it does

- Contact form with name, email, and message
- Validates input on both the frontend and backend
- Saves submissions to Supabase
- Shows a success screen after submitting
- Admin page to view all received messages (protected by a secret)
- Works on mobile too

## Folder structure

```
she-can-foundation/
├── api/
│   ├── contact.js        handles form submissions (Vercel function)
│   └── messages.js       returns all submissions for the admin page
├── index.html            the contact form
├── admin.html            admin dashboard
├── style.css             styles
├── app.js                frontend JS
├── server.js             local dev server
├── she-can-router.js     express router for local dev
├── config.js             supabase setup
├── she-can-contacts.sql  run this in Supabase to create the table
├── vercel.json           routing for Vercel
├── package.json
└── .env.example          copy this to .env and fill in your values
```

## Running it locally

First, go to your Supabase project, open the SQL editor, and run `she-can-contacts.sql` to create the table.

Then copy `.env.example` to `.env` and fill in your Supabase credentials and an admin secret:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
ADMIN_SECRET=something_only_you_know
SHE_CAN_PORT=4000
```

Install dependencies and start the server:

```bash
cd she-can-foundation
npm install
node server.js
```

Open `http://localhost:4000` for the form and `http://localhost:4000/admin` for the admin page.

## Deploying to Vercel

Push to GitHub, create a new Vercel project, and set the root directory to `she-can-foundation`. Add the same environment variables from `.env.example` in the Vercel dashboard and deploy.

The form will be at your Vercel URL and the admin at `/admin`.

## Admin page

When you open `/admin` it asks for a secret — that's the `ADMIN_SECRET` value from your environment. Once you enter it, you'll see all the contact submissions. Nothing is stored in the browser after you close the tab.

## Stack

- HTML, CSS, vanilla JS
- Node.js + Express (local)
- Vercel serverless functions (production)
- Supabase (Postgres)
