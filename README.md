# Lucky Draw App

A Japanese-localized in-store lottery / lucky draw web application built with Next.js. Staff enter a customer's receipt number and purchase amount; the app validates eligibility, draws a weighted random prize from the store's prize pool, and records the result.

## Features

- **Receipt-based lottery** — enter a receipt number and purchase amount to trigger a draw
- **Weighted random draw** — prizes are drawn proportionally by remaining quantity
- **Eligibility check** — minimum spend threshold enforced; duplicate draws on the same receipt are prevented
- **Animated rolling display** — prize names scroll before the final result is revealed
- **Draw history** — past results for a given receipt are shown in real time
- **Store management** — load store configuration by numeric Store ID; PIN-protected prize inventory inspection
- **Configurable UI** — background image URL and text position (center / bottom / left / right) are stored per-store
- **PWA ready** — includes web app manifest and icons

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Ant Design 5, styled-components 6 |
| Icons | react-icons 5 |
| Data fetching | Apollo Client 4 + GraphQL (Strapi backend) |
| Date formatting | dayjs |

## Pages

| Route | Description |
|---|---|
| `/` | Main lottery dashboard |
| `/store` | Store selector and prize inventory inspector |

## Getting Started

### Prerequisites

- Node.js 20.9+ (required by Next.js 16)
- A running Strapi instance (see [Environment Variables](#environment-variables))

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Required — base URL of the Strapi backend (GraphQL endpoint is derived as `${NEXT_PUBLIC_API_BASE_URL}/graphql`)
NEXT_PUBLIC_API_BASE_URL=https://<your-strapi-host>/strapi-luckydraw

# Reserved for a future retail-API integration — not currently read by the app
RETAIL_BASE_URL=
RETAIL_APP_ID=
RETAIL_APP_SECRET=
RETAIL_BRAND_ID=
```

`NEXT_PUBLIC_API_BASE_URL` is exposed to the browser (client-side GraphQL calls), so it must not contain secrets.

### Run

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Lint

```bash
npm run lint
```

## Usage

1. Navigate to `/store` and enter the **Store ID** to load the store configuration.
2. Return to `/` (or be redirected automatically).
3. Enter the customer's **purchase amount (金額)** and **receipt number (レシート番号)**, then press **抽選する**.
4. The animated display reveals the prize. Results are saved to the backend and shown in the history list below.

To inspect the prize inventory on the `/store` page, enter the store's **認証コード (Check PIN)**.

## Project Structure

```
src/
├── app/
│   ├── page.jsx              # Main lottery page
│   ├── store/page.jsx        # Store settings page
│   ├── index.style.js        # Styled-components for main page
│   ├── manifest.js           # PWA manifest (App Router file convention)
│   └── layout.jsx            # Root layout
├── components/
│   └── Button.style.js
└── lib/
    ├── lottery.js             # Draw logic (weighted random, rolling animation)
    ├── ApolloClient.js        # Imperative Apollo client used by the store/history context
    ├── ApolloWrapper.jsx      # Apollo Client Next.js SSR integration, wraps the app
    ├── StoreContextProvider.jsx.jsx  # Store + history GraphQL context
    ├── SettingsContextProvider.jsx
    └── settings.js
```

## Backend (Strapi)

The app communicates with a Strapi CMS via GraphQL. Required content types:

- **Store** — `Store_ID`, `Store_Name`, `Check_PIN`, `Dashboard_Title`, `Min_Spent`, `Background_URL`, `Position`, `Prize[]`
- **History** — `Code`, `Store_ID`, `Store_Name`, `Prize_Name`, `Spent`, `Create_Date`

## Deployment

### Vercel (recommended)

The app is a standard Next.js App Router project and deploys to [Vercel](https://vercel.com) with no extra configuration.

1. Push the repository to GitHub (already at `V-nut-V/tgc-lottery-jp-nextjs`) and [import the project](https://vercel.com/new) into Vercel.
2. Set the build settings (Vercel auto-detects these for Next.js):
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
3. Add the environment variables from [Environment Variables](#environment-variables) in the project's **Settings → Environment Variables**, for both the *Production* and *Preview* environments. At minimum, set `NEXT_PUBLIC_API_BASE_URL` to the Strapi host reachable from the deployment.
4. Trigger a deploy (push to the tracked branch, or **Deploy** from the dashboard).

Since `NEXT_PUBLIC_*` variables are inlined at build time, redeploy (not just restart) after changing `NEXT_PUBLIC_API_BASE_URL`.

### Self-hosted (Node server)

For a Docker container, VM, or any host that can run a persistent Node process:

```bash
npm ci
npm run build
npm run start   # starts `next start` on port 3000 (set $PORT to override)
```

Requirements:
- Node.js 20.9+
- The `.env` file (or equivalent environment variables) present at build time, since `NEXT_PUBLIC_API_BASE_URL` is baked into the client bundle during `npm run build`
- The Strapi backend reachable from both the server (SSR/GraphQL) and the client's browser (the same `NEXT_PUBLIC_API_BASE_URL` is used for both)

Run behind a reverse proxy (nginx, Caddy, etc.) for TLS termination in production.

### Static export

This app is not compatible with `next export` / static output — it uses the App Router's dynamic manifest route and runtime environment variables. Deploy it as a Node server (Vercel or self-hosted) rather than static hosting.
