# amarabdurrehman.me

Portfolio of **Amar Abdur Rehman**, a full-stack and Python engineer. It's an Apple-inspired, scroll-animated site with **Ask Amar**, an AI assistant that answers recruiters' questions from the portfolio content.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Google Gemini · Vercel

## Run locally

```bash
npm install
cp .env.example .env.local   # then paste your GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

## Edit content

Everything on the page *and* everything the chatbot knows comes from one file:
[`src/lib/content.ts`](src/lib/content.ts). Edit a fact there and it updates in both places.
Facts that only the chatbot should know (availability details, target roles, your story) go in `botExtras`.

## Structure

```
src/
  app/
    page.tsx            # section order
    layout.tsx          # fonts, SEO metadata, theme bootstrap
    api/chat/route.ts   # streaming Gemini endpoint (key stays server-side)
  components/           # hero, flagship, websites deck, chat/, …
  lib/
    content.ts          # ← all portfolio content
    knowledge.ts        # turns content into the chatbot's system prompt
public/                 # CV, case study, portrait, screenshots, OG image
```

## Deploy

Import the repo into Vercel, add `GEMINI_API_KEY` under Environment Variables, deploy, then add the
`amarabdurrehman.me` domain in Project → Settings → Domains.

Credits: the nav and the website deck are adapted from 21st.dev components by themeocean and Aakash Mehra.
