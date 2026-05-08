import ContactForm from "@/components/ContactForm";
import { EnvelopeClosedIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">contact me.</h1>

      <p className="text-muted-foreground">
        Feel free to reach out through the form below, or connect with me
        directly:
      </p>

      <div className="flex flex-wrap gap-4">
        <Link
          href="mailto:mayankmalik263@gmail.com"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <EnvelopeClosedIcon className="h-4 w-4" />
          mayankmalik263@gmail.com
        </Link>
        <Link
          href="https://www.linkedin.com/in/mayankmalik263/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <LinkedInLogoIcon className="h-4 w-4" />
          LinkedIn
        </Link>
      </div>

      <ContactForm />
    </article>
  );
}
