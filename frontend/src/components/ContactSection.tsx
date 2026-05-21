import { ContactForm } from "./ContactForm";
import { SectionHeader } from "./SectionHeader";

const contacts = [
  {
    label: "GitHub",
    href: "https://github.com/ivanbogomolov246-lang",
    text: "ivanbogomolov246-lang",
  },
  {
    label: "Telegram",
    href: "https://t.me/IVANELL0",
    text: "@IVANELL0",
  },
  {
    label: "Email",
    href: "mailto:ivanbogomolov246@gmail.com",
    text: "ivanbogomolov246@gmail.com",
  },
];

export const ContactSection = () => {
  return (
    <section className="section" id="contacts">
      <SectionHeader
        eyebrow="Контакты"
        title="Обсудим ваш проект"
        description="Оставьте заявку, и я лично свяжусь с вами для уточнения требований и оценки задачи."
      />

      <div className="contacts-grid">
        <article className="card contact-links">
          <h3>Связаться со мной</h3>
          <ul>
            {contacts.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <ContactForm />
      </div>
    </section>
  );
};
