import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useProjects } from "../features/projects/useProjects";
import { useTasks } from "../features/tasks/useTasks";
import { useSprints } from "../features/sprints/useSprints";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { sprints } = useSprints();

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completionRate = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      change: `${sprints.length} sprints planned`,
      icon: FolderKanban,
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      change: "Across all projects",
      icon: ListTodo,
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      change: `${completionRate}% completion`,
      icon: CheckCircle2,
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      change: "Active tasks",
      icon: Clock3,
    },
  ];

  const recentProjects = projects.slice(0, 4);

  const recentTasks = tasks.slice(0, 5);

  function getProjectProgress(projectId) {
    const projectTasks = tasks.filter(
      (task) => task.projectId === projectId
    );

    if (!projectTasks.length) return 0;

    const done = projectTasks.filter(
      (task) => task.status === "Done"
    ).length;

    return Math.round((done / projectTasks.length) * 100);
  }

  return (
    <div className="overview-page">
      <div className="overview-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>
            Track your projects, tasks, and team productivity.
          </p>
        </div>

        <span>{new Date().toLocaleDateString()}</span>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-top">
                <span className="stat-icon">
                  <Icon size={22} />
                </span>
                <ArrowUpRight size={18} />
              </div>

              <p>{stat.title}</p>
              <h2>{stat.value}</h2>
              <small>{stat.change}</small>
            </div>
          );
        })}
      </div>

      <div className="overview-grid">
        <section className="overview-panel">
          <div className="panel-heading">
            <h2>Recent Projects</h2>
            <Link to="/dashboard/projects">View All</Link>
          </div>

          {recentProjects.length === 0 && (
            <p>No projects created yet.</p>
          )}

          {recentProjects.map((project) => {
            const progress = getProjectProgress(project.id);

            return (
              <div className="recent-project" key={project.id}>
                <div className="recent-project-top">
                  <strong>{project.name}</strong>
                  <span>{project.status}</span>
                </div>

                <div className="progress-info">
                  <span>Task Completion</span>
                  <span>{progress}%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </section>

        <section className="overview-panel">
          <div className="panel-heading">
            <h2>Recent Tasks</h2>
            <Activity size={19} />
          </div>

          {recentTasks.length === 0 && (
            <p>No tasks created yet.</p>
          )}

          {recentTasks.map((task) => (
            <div className="activity-item" key={task.id}>
              <span className="activity-dot" />
              <div>
                <p>{task.title}</p>
                <small>
                  {task.status} · {task.priority} Priority
                </small>
              </div>
            </div>
          ))}

          <Link to="/dashboard/tasks">View Task Board</Link>
        </section>
      </div>
    </div>
  );
}