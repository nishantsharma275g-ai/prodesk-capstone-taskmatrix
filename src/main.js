import "./style.css";

const githubUrl = "https://github.com/nishantsharma275g-ai/prodesk-capstone-taskmatrix";
const figmaUrl = "https://www.figma.com/design/Fl5K12wHsa148slrXr9JPX/TaskMatrix-%E2%80%94-UI-UX-Design?node-id=5-9&t=Oywjqlpi9QSljyd3-1";

document.querySelector("#root").innerHTML = `
  <header class="nav">
    <a class="brand" href="#">
      <span class="brand-mark">T</span>
      <span>TaskMatrix</span>
    </a>
    <span class="status"><span></span> Capstone in development</span>
  </header>

  <main>
    <section class="hero">
      <div class="eyebrow">PRODESK IT · SPRINT 13 CAPSTONE</div>
      <h1>Project management,<br><span>built for Agile teams.</span></h1>
      <p class="hero-copy">
        TaskMatrix is an enterprise Agile project management platform for
        planning projects, managing sprints, organizing tasks, and keeping
        teams aligned in one workspace.
      </p>

      <div class="actions">
        <a class="btn primary" href="${githubUrl}" target="_blank" rel="noreferrer">View GitHub ↗</a>
        <a class="btn secondary" href="${figmaUrl}" target="_blank" rel="noreferrer">View Figma ↗</a>
      </div>

      <div class="notice">
        <div class="notice-icon">✦</div>
        <div>
          <strong>The full application is coming soon.</strong>
          <p>Sprint 13 planning, UI/UX design, and system architecture are complete. Application development is next.</p>
        </div>
      </div>
    </section>

    <section class="progress-section">
      <div class="section-heading">
        <div>
          <p class="kicker">SPRINT 13 PROGRESS</p>
          <h2>From blueprint to product.</h2>
        </div>
        <span class="complete">Planning complete</span>
      </div>

      <div class="cards">
        <article class="card done">
          <div class="icon">✓</div>
          <div>
            <span class="tag">01</span>
            <h3>Product Planning</h3>
            <p>PRD, product vision, users, roles, and prioritized P0/P1/P2 features.</p>
          </div>
        </article>

        <article class="card done">
          <div class="icon">✓</div>
          <div>
            <span class="tag">02</span>
            <h3>UI/UX Design</h3>
            <p>Core authentication, dashboard, and project/task view wireframes in Figma.</p>
          </div>
        </article>

        <article class="card done">
          <div class="icon">✓</div>
          <div>
            <span class="tag">03</span>
            <h3>System Architecture</h3>
            <p>MongoDB ERD, Zustand state tree, and planned REST API architecture.</p>
          </div>
        </article>

        <article class="card next">
          <div class="icon">→</div>
          <div>
            <span class="tag">04</span>
            <h3>Application Development</h3>
            <p>Next.js, MongoDB, authentication, projects, tasks, sprints, and Kanban workflows.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="stack-section">
      <p class="kicker">PLANNED TECHNOLOGY</p>
      <div class="stack">
        <span>Next.js</span><span>React</span><span>MongoDB</span><span>Zustand</span><span>Tailwind CSS</span><span>Auth.js</span><span>Recharts</span><span>Vercel</span>
      </div>
    </section>
  </main>

  <footer>
    <div>
      <strong>TaskMatrix</strong>
      <span>Enterprise Agile Project Management Platform</span>
    </div>
    <span>© 2026 Prodesk IT Capstone</span>
  </footer>
`;
