import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  CalendarRange,
  BarChart3,
  Layers3,
  Zap,
} from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import "./HomePage.css";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Create projects, organize priorities, and keep work moving forward.",
  },
  {
    icon: ListTodo,
    title: "Kanban Task Boards",
    description:
      "Track tasks from To Do to In Progress and Done with a visual workflow.",
  },
  {
    icon: CalendarRange,
    title: "Sprint Planning",
    description:
      "Plan sprints, assign tasks, and monitor completion in real time.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Understand project progress with an easy-to-read dashboard.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your project",
    description: "Set up a project and define what needs to be accomplished.",
  },
  {
    number: "02",
    title: "Organize your tasks",
    description: "Add tasks, assign priorities, and manage their status.",
  },
  {
    number: "03",
    title: "Track your progress",
    description: "Plan sprints and follow progress through your dashboard.",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  const dashboardLink = user ? "/dashboard" : "/signup";

  return (
    <div className="home-page">
      <header className="home-header">
        <nav className="home-nav">
          <Link to="/" className="home-logo">
            <span className="home-logo-icon">
              <Layers3 size={22} />
            </span>
            DevFlow
          </Link>

          <div className="home-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>

          <div className="home-nav-actions">
            {user ? (
              <Link to="/dashboard" className="home-nav-button">
                Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="home-login-link">
                  Log In
                </Link>
                <Link to="/signup" className="home-nav-button">
                  Get Started <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-eyebrow">
              <Zap size={15} />
              A smarter way to manage projects
            </span>

            <h1>
              Bring clarity to your work.
              <span> Move projects forward.</span>
            </h1>

            <p>
              Organize projects, manage tasks, plan sprints, and track
              progress — all from one simple workspace.
            </p>

            <div className="home-hero-actions">
              <Link to={dashboardLink} className="home-primary-cta">
                {user ? "Open Dashboard" : "Get Started Free"}
                <ArrowRight size={19} />
              </Link>

              <a href="#features" className="home-secondary-cta">
                Explore Features
              </a>
            </div>

            <div className="home-hero-benefits">
              <span>
                <CheckCircle2 size={17} /> Simple workflow
              </span>
              <span>
                <CheckCircle2 size={17} /> Visual task tracking
              </span>
              <span>
                <CheckCircle2 size={17} /> Sprint planning
              </span>
            </div>
          </div>

          <div className="home-preview">
            <div className="preview-topbar">
              <div className="preview-dots">
                <i />
                <i />
                <i />
              </div>
              <span>DevFlow Workspace</span>
              <span className="preview-status">Overview</span>
            </div>

            <div className="preview-content">
              <div className="preview-title">
                <div>
                  <small>PROJECT OVERVIEW</small>
                  <h3>Keep everything on track</h3>
                </div>
                <span className="preview-avatar">DF</span>
              </div>

              <div className="preview-stats">
                <div>
                  <small>Projects</small>
                  <strong>08</strong>
                  <span>Active workspace</span>
                </div>
                <div>
                  <small>Tasks</small>
                  <strong>32</strong>
                  <span>Across projects</span>
                </div>
                <div>
                  <small>Completed</small>
                  <strong>24</strong>
                  <span>Moving forward</span>
                </div>
              </div>

              <div className="preview-board-title">
                <strong>Task Board</strong>
                <span>Sample preview</span>
              </div>

              <div className="preview-board">
                {[
                  {
                    title: "To Do",
                    items: ["Research requirements", "Plan milestones"],
                    color: "todo",
                  },
                  {
                    title: "In Progress",
                    items: ["Build dashboard", "Design components"],
                    color: "progress",
                  },
                  {
                    title: "Done",
                    items: ["Project setup", "Define scope"],
                    color: "done",
                  },
                ].map((column) => (
                  <div className="preview-column" key={column.title}>
                    <div className="preview-column-heading">
                      <span className={`preview-dot ${column.color}`} />
                      {column.title}
                    </div>

                    {column.items.map((item) => (
                      <div className="preview-task" key={item}>
                        <span>{item}</span>
                        <div className="preview-task-footer">
                          <span className="preview-task-line" />
                          <span className="preview-task-circle" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="home-features" id="features">
          <div className="home-section-heading">
            <span className="home-section-label">FEATURES</span>
            <h2>Everything you need to stay organized</h2>
            <p>
              Essential project management tools in one clean, focused
              workspace.
            </p>
          </div>

          <div className="home-features-grid">
            {features.map(({ icon: Icon, title, description }) => (
              <article className="home-feature-card" key={title}>
                <span className="home-feature-icon">
                  <Icon size={25} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-how" id="how-it-works">
          <div className="home-section-heading">
            <span className="home-section-label">HOW IT WORKS</span>
            <h2>From idea to completion</h2>
            <p>Get your workflow organized in three simple steps.</p>
          </div>

          <div className="home-steps">
            {steps.map((step) => (
              <article className="home-step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-bottom-cta">
          <div>
            <h2>Ready to organize your next project?</h2>
            <p>
              Start managing your projects, tasks, and sprints with DevFlow.
            </p>
          </div>

          <Link to={dashboardLink} className="home-primary-cta">
            {user ? "Go to Dashboard" : "Get Started"}
            <ArrowRight size={19} />
          </Link>
        </section>
      </main>

      <footer className="home-footer">
        <Link to="/" className="home-logo">
          <Layers3 size={21} /> DevFlow
        </Link>
        <p>© {new Date().getFullYear()} DevFlow. Built for focused work.</p>
      </footer>
    </div>
  );
}