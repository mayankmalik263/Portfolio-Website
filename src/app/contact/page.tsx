import dynamic from "next/dynamic";
const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-lg bg-muted" />,
});

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">contact me.</h1>

      <ContactForm />
    </article>
  );
}
