# SEO / AEO / GEO Setup Guide - mayankmalik.vercel.app

This guide finishes the strategy: get your Google Analytics (GA4) and Google Tag
Manager (GTM) IDs, wire them in (already coded), and submit your sitemap to Search
Console so the site starts ranking.

Your site domain: **https://mayankmalik.vercel.app**

---

## What is already done in the code

You do NOT need to touch code for these - they are already implemented:

- **Google Search Console verification** tag (already present in `layout.tsx`).
- **Sitemap** at `/sitemap.xml` (auto-generated, includes blog posts).
- **robots.txt** at `/robots.txt` (allows all crawlers + points to sitemap).
- **Titles + meta descriptions** on every page (home, projects, blog, contact, privacy).
- **SEO keywords** targeting three audiences:
  1. Recruiters searching your name ("Mayank Malik", "Mayank Malik portfolio", "Mayank Malik UPES").
  2. AI/ML engineer roles ("AI Engineer", "Machine Learning Engineer", "LLM developer", "UPES CSE AI ML").
  3. Community / leadership ("community leader", "tech community lead").
- **Person schema (JSON-LD)** - tells Google and AI answer engines who you are, where you studied, and what you know.
- **FAQ section + FAQPage schema** on the homepage - this is the GEO/AEO piece. It helps ChatGPT, Gemini, Perplexity and Google's AI Overviews answer "Who is Mayank Malik?" using your own words.
- **Google Tag Manager container** - wired in and controlled by one environment variable: `NEXT_PUBLIC_GTM_ID`. It only activates once you add your real GTM ID (below).

The only thing left for you to do is create the accounts, get the IDs, and submit the sitemap.

---

## Step 1 - Create Google Analytics 4 (GA4)

1. Go to https://analytics.google.com and sign in with your Google account.
2. Admin (bottom-left gear) -> **Create** -> **Account**. Name it (e.g. "Mayank Portfolio"). Accept defaults, Next.
3. Create a **Property**: name "mayankmalik", set your time zone (India) and currency. Next.
4. Fill business details, click **Create**, accept the terms.
5. Choose platform **Web**. Website URL: `mayankmalik.vercel.app`, stream name "Portfolio". Click **Create stream**.
6. You will now see a **Measurement ID** that looks like `G-XXXXXXXXXX`. **Copy it** - you need it in Step 3.

> Note (verify current UI): Google occasionally changes the Analytics setup screens, so exact button labels may differ slightly from the above. The Measurement ID always has the `G-` prefix.

---

## Step 2 - Create Google Tag Manager (GTM)

1. Go to https://tagmanager.com and sign in.
2. **Create Account**. Account name "Mayank Portfolio", country India.
3. Container name: `mayankmalik.vercel.app`. Target platform: **Web**. Click **Create**, accept terms.
4. At the top you will see your **Container ID** like `GTM-XXXXXXX`. **Copy it** - this is the one the code needs.

---

## Step 3 - Connect GA4 inside GTM (GTM as the hub)

Because the code routes everything through GTM, you add GA4 from inside GTM's dashboard - no code change needed.

1. In GTM, open your container -> **Tags** -> **New**.
2. Tag Configuration -> **Google Analytics: GA4 Configuration** (may be named "Google Tag" in newer UI).
3. Paste your GA4 **Measurement ID** (`G-XXXXXXXXXX`) from Step 1.
4. Triggering -> choose **Initialization - All Pages** (or "All Pages").
5. **Save**.
6. Click **Submit** (top-right) -> **Publish** to make the tag live.

Now GA4 fires through GTM on every page.

---

## Step 4 - Add your GTM ID to the site

1. In the project root there is a file `.env.local` (create it if missing).
2. Add this line, using your real ID from Step 2:

   ```
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

3. If you deploy on **Vercel**, also add it there so production picks it up:
   - Vercel dashboard -> your project -> **Settings** -> **Environment Variables**.
   - Name: `NEXT_PUBLIC_GTM_ID`, Value: `GTM-XXXXXXX`, Environments: Production (and Preview if you like).
   - Save.

4. **Redeploy** the site (push to git, or click "Redeploy" in Vercel).

The GTM script only loads when this variable is set, so nothing breaks if it is empty.

---

## Step 5 - Verify it works

1. Open your live site, then open browser DevTools -> Network tab, reload, and search for `gtm.js` - it should load.
2. In GTM click **Preview**, enter your site URL, and confirm your GA4 tag fires.
3. In GA4 -> **Reports** -> **Realtime**, open your site in another tab; you should appear as an active user within a minute.

---

## Step 6 - Google Search Console + submit sitemap

Your verification tag is already in the code, so verification should pass automatically.

1. Go to https://search.google.com/search-console.
2. Add property -> **URL prefix** -> enter `https://mayankmalik.vercel.app` -> Continue.
3. Choose the **HTML tag** method. Since the tag is already in your site, just click **Verify**.
   - If it fails, copy the `content="..."` value Google shows you and confirm it matches the `verification.google` value in `src/app/layout.tsx`; update if Google issued a new one, redeploy, then verify.
4. Once verified: left menu -> **Sitemaps** -> enter `sitemap.xml` -> **Submit**.
5. Optional but useful: **URL Inspection** -> paste your homepage URL -> **Request indexing**.

---

## Step 7 - Wait and watch

- Indexing typically takes a few days to a couple of weeks; ranking for your own name usually comes first.
- Check Search Console -> **Performance** to see which queries bring people in.
- Re-request indexing whenever you publish a new blog post or project.

---

## Why the FAQ + schema matters for GEO/AEO

GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) are about
being the source AI assistants quote when someone asks about you. The FAQ block on
your homepage answers "Who is Mayank Malik?", "What does he do?", "What are his
skills?", "Where does he study?", and "How to contact him?" in plain language, and
the FAQPage structured data makes those answers machine-readable. To strengthen this
further over time: keep the answers factual and specific, add new Q&As as your work
evolves, and publish blog posts on your focus topics so there is more indexable text
tying your name to "AI engineer" and "machine learning".

---

## Quick checklist

- [ ] GA4 created, Measurement ID copied (`G-...`)
- [ ] GTM created, Container ID copied (`GTM-...`)
- [ ] GA4 tag added + published inside GTM
- [ ] `NEXT_PUBLIC_GTM_ID` set in `.env.local` and in Vercel
- [ ] Site redeployed
- [ ] `gtm.js` loads + GA4 Realtime shows traffic
- [ ] Search Console verified
- [ ] `sitemap.xml` submitted
- [ ] Homepage indexing requested
