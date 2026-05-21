import { SectionHeader } from "./SectionHeader";

const workflowSteps = [
  {
    title: "Анализ требований",
    description:
      "Синхронизирую бизнес-цели, метрики и технические ограничения перед началом реализации.",
  },
  {
    title: "Проектирование",
    description:
      "Проектирую архитектуру, API-контракты, модель данных и стратегию масштабирования.",
  },
  {
    title: "Разработка",
    description:
      "Реализую backend и frontend, подключаю внешние сервисы и настраиваю delivery-процессы.",
  },
  {
    title: "Тестирование",
    description: "Проверяю ключевые сценарии, обработку ошибок и корректность интеграций.",
  },
  {
    title: "Оптимизация",
    description:
      "Улучшаю скорость и стабильность через кеширование, профилирование и снижение сетевых затрат.",
  },
];

const aiTools = [
  "ChatGPT",
  "Cursor",
  "Codex",
  "AI для генерации идей",
  "AI для рефакторинга",
  "AI для ускорения рутинных задач",
];

export const WorkflowSection = () => {
  return (
    <section className="section section--accent" id="workflow">
      <SectionHeader
        eyebrow="Как я работаю"
        title="Прозрачный процесс с измеримым результатом"
        description="Процесс построен вокруг бизнес-ценности, качества кода и предсказуемого delivery."
      />

      <div className="workflow-grid">
        <div className="timeline">
          {workflowSteps.map((step, index) => (
            <article className="timeline__step card" key={step.title}>
              <p className="timeline__index">0{index + 1}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>

        <article className="card ai-card">
          <h3>AI в рабочем процессе</h3>
          <p>
            Использую AI как ускоритель инженерной работы: быстрее формирую гипотезы, улучшаю
            рефакторинг и сокращаю рутинные операции.
          </p>
          <ul className="check-list">
            {aiTools.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};
