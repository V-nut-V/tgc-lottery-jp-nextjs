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
| Framework | Next.js 15 (App Router) |
| UI | React 19, Ant Design 5, styled-components 6 |
| Icons | react-icons 5 |
| Data fetching | Apollo Client 3 + GraphQL (Strapi backend) |
| Date formatting | dayjs |

## Pages

| Route | Description |
|---|---|
| `/` | Main lottery dashboard |
| `/store` | Store selector and prize inventory inspector |

## Getting Started

### Prerequisites

- Node.js 18+
- A running Strapi instance (see [Environment Variables](#environment-variables))

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://<your-strapi-host>/strapi-luckydraw
```

### Run

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   └── layout.jsx            # Root layout
├── components/
│   └── Button.style.js
└── lib/
    ├── lottery.js             # Draw logic (weighted random, rolling animation)
    ├── ApolloClient.js        # Apollo client setup
    ├── ApolloWrapper.jsx
    ├── StoreContextProvider.jsx  # Store + history GraphQL context
    ├── SettingsContextProvider.jsx
    └── settings.js
```

## Backend (Strapi)

The app communicates with a Strapi CMS via GraphQL. Required content types:

- **Store** — `Store_ID`, `Store_Name`, `Check_PIN`, `Dashboard_Title`, `Min_Spent`, `Background_URL`, `Position`, `Prize[]`
- **History** — `Code`, `Store_ID`, `Store_Name`, `Prize_Name`, `Spent`, `Create_Date`