import { useAiSummary } from "../hooks/useAiSummary";
import { SectionHeader } from "./SectionHeader";

export const AiHelperSection = () => {
  const { state, setInput, generateSummary } = useAiSummary();

  return (
    <section className="section section--ai" id="ai-helper">
      <SectionHeader
        eyebrow="AI-помощник"
        title="Сгенерировать краткое описание проекта"
        description="Введите описание проекта в свободной форме. AI сформирует короткое summary для портфолио."
      />

      <div className="ai-helper card">
        <label htmlFor="project-description">Описание проекта</label>
        <textarea
          id="project-description"
          value={state.input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Например: разработали сервис на NestJS с очередями, Redis-кешем и AI-модулем для обработки заявок..."
          rows={7}
        />

        <button type="button" className="btn btn--primary" onClick={generateSummary} disabled={state.isLoading}>
          {state.isLoading ? "Генерируем..." : "Сгенерировать краткое описание"}
        </button>

        {state.error ? <p className="form-message form-message--error">{state.error}</p> : null}

        {state.output ? (
          <article className="ai-result">
            <h3>Результат</h3>
            <p>{state.output}</p>
          </article>
        ) : null}
      </div>
    </section>
  );
};
