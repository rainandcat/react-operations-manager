const projectStatus = '基礎骨架完成';

export function App() {
  return (
    <main className="project-shell">
      <section className="project-intro" aria-labelledby="project-title">
        <p className="eyebrow">Operations Suite / Manager</p>
        <h1 id="project-title">A deliberate foundation for operational work.</h1>
        <p className="project-summary">
          This portfolio application uses locally authored mock data only. Dashboard, customer
          review, and activity workflows will be introduced as focused features.
        </p>
        <p className="status" role="status">
          {projectStatus}
        </p>
      </section>
    </main>
  );
}
