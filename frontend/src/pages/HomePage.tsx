import { AboutSection } from "../components/AboutSection";
import { AiHelperSection } from "../components/AiHelperSection";
import { CasesSection } from "../components/CasesSection";
import { ContactSection } from "../components/ContactSection";
import { HeroSection } from "../components/HeroSection";
import { WorkflowSection } from "../components/WorkflowSection";

const navItems = [
  { href: "#about", label: "Обо мне" },
  { href: "#workflow", label: "Как я работаю" },
  { href: "#cases", label: "Кейсы" },
  { href: "#ai-helper", label: "AI-помощник" },
  { href: "#contacts", label: "Контакты" },
];

export const HomePage = () => {
  return (
    <div className="page">
      <div className="background-shape background-shape--left" aria-hidden="true" />
      <div className="background-shape background-shape--right" aria-hidden="true" />

      <header className="topbar">
        <a className="topbar__brand" href="#top">
          IB
        </a>
        <nav aria-label="Навигация по странице">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <HeroSection />
        <AboutSection />
        <WorkflowSection />
        <CasesSection />
        <AiHelperSection />
        <ContactSection />
      </main>

      <footer className="footer">
        <p>(c) {new Date().getFullYear()} Иван Богомолов. Fullstack, backend и AI-интеграции.</p>
      </footer>
    </div>
  );
};
