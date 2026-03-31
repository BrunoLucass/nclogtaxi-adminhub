<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/cdd1171c-6da5-4721-a29d-f4193d19cb3a

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set:
   - `VITE_API_BASE_URL` — middleware API (produção: `https://nctaxi-middleware.onrender.com`; local: `http://localhost:3000` se rodar o backend na máquina)
   - `VITE_SUPABASE_ANON_KEY` — Supabase **anon** key (Project Settings → API), used as the `apikey` header on `POST /auth/login`
   - `GEMINI_API_KEY` (optional) for AI Studio features
3. User roles (`admin`, `requester`, etc.) and `organization_id` are set in Supabase under **Authentication → Users → app_metadata** (see API reference from your backend team).
4. The dev server listens on **port 5173** so the API can use **3000**. Ensure the backend allows **CORS** for `http://localhost:5173`.
5. Run the app: `npm run dev` and open `http://localhost:5173`
