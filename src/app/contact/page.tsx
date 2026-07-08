import dynamic from "next/dynamic";
import type { Metadata } from "next";
const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-lg bg-muted" />,
});

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mayank Malik - AI/ML engineer and developer. Reach out for collaborations, opportunities, freelance work, or community initiatives.",
  keywords: [
    "contact Mayank Malik",
    "hire AI engineer",
    "hire ML engineer",
    "Mayank Malik email",
  ],
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">contact me.</h1>

      <ContactForm />
    </article>
  );
}
