import profilePhoto from "../assets/ivan-bogomolov.jpg";

const stats = [
  { value: "3+", label: "года коммерческого опыта" },
  { value: "40%", label: "снижение внешних запросов благодаря Redis-кешу" },
  { value: "110", label: "запросов в день в LLM-сервисе" },
];

export const HeroSection = () => {
  return (
    <section className="hero" id="top">
      <div className="hero__content">
        <p className="hero__eyebrow">Иван Богомолов</p>
        <h1>Fullstack разработчик: backend-системы, React-интерфейсы и AI-интеграции</h1>
        <p className="hero__description">
          Проектирую и запускаю сервисы с фокусом на производительность, надежные API и
          автоматизацию рутинных процессов через LLM.
        </p>
        <div className="hero__actions">
          <a href="#cases" className="btn btn--primary">
            Смотреть кейсы
          </a>
          <a href="#contacts" className="btn btn--secondary">
            Обсудить проект
          </a>
        </div>
      </div>

      <aside className="hero__stats" aria-label="Ключевые показатели">
        <figure className="hero__portrait">
          <img src={profilePhoto} alt="Иван Богомолов" loading="lazy" />
        </figure>

        {stats.map((stat) => (
          <article key={stat.label} className="hero__stat-card">
            <p className="hero__stat-value">{stat.value}</p>
            <p className="hero__stat-label">{stat.label}</p>
          </article>
        ))}
      </aside>
    </section>
  );
};
