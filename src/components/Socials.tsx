import data from "@/data/socials.json";
import { socialSchema } from "@/lib/schemas";
import Icon from "./Icon";

export default function Socials() {
  const socials = socialSchema.parse(data).socials;

  return (
    <section className="flex gap-6">
      {socials.map((item) => (
        <a
          href={item.href}
          key={item.name}
          target="_blank"
          className="text-muted-foreground transition-[color,transform] duration-200 hover:-translate-y-0.5 hover:text-foreground active:scale-90 motion-reduce:hover:translate-y-0"
          rel="noopener noreferrer"
          title={item.name}
        >
          <span className="sr-only">{item.name}</span>
          <Icon name={item.icon} aria-hidden="true" className="size-5" />
        </a>
      ))}
    </section>
  );
}
