import { SectionHeader } from "./SectionHeader";

const stack = [
  "JavaScript",
  "TypeScript",
  "Node.js",
  "NestJS",
  "React",
  "PostgreSQL",
  "Redis",
  "WebSocket",
  "Docker",
];

const experience = [
  "backend-сервисы на NestJS",
  "работа с LLM",
  "проектирование REST API",
  "WebSocket realtime-функциональность",
  "интеграции с внешними сервисами",
  "кеширование через Redis",
  "frontend-разработка на React",
];

const directions = ["Fullstack", "Backend", "AI-интеграции", "Автоматизация"];

export const AboutSection = () => {
  return (
    <section className="section" id="about">
      <SectionHeader
        eyebrow="Обо мне"
        title="Создаю и масштабирую продукты от API до интерфейса"
        description="Полный цикл разработки: архитектура, модель данных, backend-логика, frontend, интеграции и AI-функции."
      />

      <div className="about-grid">
        <article className="card">
          <h3>Технологический стек</h3>
          <ul className="tag-list">
            {stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3>Опыт</h3>
          <ul className="check-list">
            {experience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3>Направления</h3>
          <ul className="direction-list">
            {directions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};
