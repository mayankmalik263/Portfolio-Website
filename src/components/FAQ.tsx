import faqData from "@/data/faq.json";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs = faqData as FaqItem[];

export default function FAQ() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="flex flex-col gap-8" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 id="faq-heading" className="title text-3xl">
        faq.
      </h2>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border bg-card px-4 py-3"
          >
            <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
