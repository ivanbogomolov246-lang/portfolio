import { SectionHeader } from "./SectionHeader";

const cases = [
  {
    title: "LLM-сервис на NestJS",
    points: [
      "~110 запросов в день",
      "Redis снизил количество внешних запросов на 40%",
      "WebSocket для realtime-обновлений",
      "REST API для интеграций и клиентских приложений",
    ],
  },
  {
    title: "CRM + личные кабинеты",
    points: [
      "многосторонние интеграции с внешними системами",
      "JWT-аутентификация и ролевой доступ",
      "оптимизация нагрузки и времени ответа",
    ],
  },
  {
    title: "AI workflow / Telegram bot / n8n",
    points: [
      "автоматизация бизнес-процессов через n8n",
      "бот для уведомлений и внутренних сценариев",
      "LLM-пайплайны для обработки и генерации контента",
    ],
  },
];

export const CasesSection = () => {
  return (
    <section className="section" id="cases">
      <SectionHeader
        eyebrow="Кейсы"
        title="Проекты, где архитектура и оптимизация влияют на результат"
        description="Каждый проект реализован с фокусом на масштабируемость, надежность и поддержку."
      />

      <div className="cases-grid">
        {cases.map((project) => (
          <article className="case-card" key={project.title}>
            <h3>{project.title}</h3>
            <ul>
              {project.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
