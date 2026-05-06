# Mayank Malik's Portfolio

A clean, minimal, and lightning-fast personal portfolio website built with Next.js, Tailwind CSS, and Shadcn UI. 

*Updated: May 7, 2026*

## Features

- **Minimal Design:** Styled with Tailwind CSS and Shadcn UI components.
- **Local Markdown Blog:** Lightning-fast, serverless blog system powered by `gray-matter` and `next-mdx-remote`.
- **Contact Form:** Direct email integration using Resend.
- **Dynamic Content:** Showcases featured projects, recent posts, and extensive professional experience.
- **Responsive & Accessible:** Fully optimized for mobile and desktop with a built-in light/dark mode toggle.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + clsx/tailwind-merge
- **UI Components:** Shadcn UI + Radix Primitives
- **Icons:** Lucide React
- **Email:** Resend API
- **Content:** Local Markdown / JSON

## What's New?
This portfolio was heavily modified and streamlined from its original template to provide a simpler, highly performant, and maintenance-free experience:
- **Removed the Backend:** Transitioned from a complex Python FastAPI/PostgreSQL backend to a 100% serverless static markdown file system.
- **Removed the Chatbot:** Purged the legacy OpenAI chatbot integration to reduce dependencies, API costs, and complexity.
- **Complete Personalization:** Fully integrated professional experience, education, and social links based on real-world data.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/mayankmalik263/Portfolio-Website.git my-portfolio
cd my-portfolio

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your RESEND_API_KEY to .env.local

# Start the development server
npm run dev
```

## Customization

- Update personal info in `src/data/*.json` (home, socials, career, education, projects)
- Add new blog posts inside the `content/blog/` directory using Markdown (`.md` or `.mdx`)
- Replace your resume at `public/resume.pdf`

## Deployment

Simply push your code to GitHub and connect it to Vercel for instant, zero-configuration deployment. 

## Acknowledgements

The foundation of this portfolio was originally forked from [Tedawf's Portfolio Template](https://github.com/tedawf/tedawf.com). It has since been heavily modified, restructured, and personalized.

## License

MIT
