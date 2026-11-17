import { useMemo, useState } from "react";
import { CalendarDays, Plus, Pencil, Trash2, X } from "lucide-react";

import { useSprints } from "./useSprints";
import { useProjects } from "../projects/useProjects";
import { useTasks } from "../tasks/useTasks";

import "./SprintsPage.css";
import "../../pages/ProjectsPage.css";
const emptyForm = {
  name: "",
  goal: "",
  projectId: "",
  startDate: "",
  endDate: "",
  taskIds: [],
};

export default function SprintsPage() {
  const { sprints, addSprint, updateSprint, deleteSprint } = useSprints();
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const availableTasks = useMemo(
    () => tasks.filter((task) => task.projectId === form.projectId),
    [tasks, form.projectId]
  );

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      projectId: projects[0]?.id ?? "",
    });
    setShowForm(true);
  }

  function openEdit(sprint) {
    setEditingId(sprint.id);
    setForm({
      name: sprint.name,
      goal: sprint.goal,
      projectId: sprint.projectId,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      taskIds: sprint.taskIds ?? [],
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.projectId) return;
    if (form.endDate < form.startDate) {
      window.alert("End date cannot be before start date.");
      return;
    }

    const data = {
      ...form,
      name: form.name.trim(),
      goal: form.goal.trim(),
    };

    if (editingId) updateSprint(editingId, data);
    else addSprint(data);

    setShowForm(false);
    setEditingId(null);
  }

  function toggleTask(taskId) {
    setForm((prev) => ({
      ...prev,
      taskIds: prev.taskIds.includes(taskId)
        ? prev.taskIds.filter((id) => id !== taskId)
        : [...prev.taskIds, taskId],
    }));
  }

  function handleDelete(sprint) {
    if (window.confirm(`Delete sprint "${sprint.name}"?`)) {
      deleteSprint(sprint.id);
    }
  }

  function getProgress(sprint) {
    const assignedTasks = tasks.filter(
      (task) =>
        task.projectId === sprint.projectId &&
        sprint.taskIds.includes(task.id)
    );

    if (!assignedTasks.length) return 0;

    const completed = assignedTasks.filter(
      (task) => task.status === "Done"
    ).length;

    return Math.round((completed / assignedTasks.length) * 100);
  }

  return (
    <div className="sprints-page">
      <div className="sprints-heading">
        <div>
          <h1>Sprint Planning</h1>
          <p>Plan iterations, assign tasks, and track progress.</p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreate}
          disabled={projects.length === 0}
        >
          <Plus size={18} /> New Sprint
        </button>
      </div>

      {projects.length === 0 && (
        <p>Create a project first to start sprint planning.</p>
      )}

      <div className="sprints-grid">
        {sprints.map((sprint) => {
          const progress = getProgress(sprint);
          const project = projects.find(
            (item) => item.id === sprint.projectId
          );

          return (
            <article className="sprint-card" key={sprint.id}>
              <div className="sprint-card-top">
                <span className="sprint-icon">
                  <CalendarDays size={21} />
                </span>
                <span className="sprint-project">
                  {project?.name ?? "Deleted Project"}
                </span>
              </div>

              <h2>{sprint.name}</h2>
              <p>{sprint.goal || "No sprint goal provided."}</p>

              <div className="sprint-dates">
                <span>Start: {sprint.startDate}</span>
                <span>End: {sprint.endDate}</span>
              </div>

              <div className="sprint-progress-heading">
                <strong>Progress</strong>
                <span>{progress}%</span>
              </div>

              <div className="sprint-progress-track">
                <div
                  className="sprint-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <small>{sprint.taskIds.length} assigned tasks</small>

              <div className="sprint-actions">
                <button onClick={() => openEdit(sprint)}>
                  <Pencil size={15} /> Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(sprint)}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {sprints.length === 0 && (
        <div className="sprints-empty">
          <CalendarDays size={35} />
          <h2>No sprints yet</h2>
          <p>Create your first sprint to organize work.</p>
        </div>
      )}

      {showForm && (
        <div className="project-modal-overlay">
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sprint-form-title"
          >
            <div className="project-modal-heading">
              <h2 id="sprint-form-title">
                {editingId ? "Edit Sprint" : "Create Sprint"}
              </h2>
              <button
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="sprint-name">Sprint Name</label>
              <input
                id="sprint-name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />

              <label htmlFor="sprint-goal">Sprint Goal</label>
              <textarea
                id="sprint-goal"
                rows={3}
                value={form.goal}
                onChange={(event) =>
                  setForm({ ...form, goal: event.target.value })
                }
              />

              <label htmlFor="sprint-project">Project</label>
              <select
                id="sprint-project"
                required
                value={form.projectId}
                onChange={(event) =>
                  setForm({
                    ...form,
                    projectId: event.target.value,
                    taskIds: [],
                  })
                }
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <label htmlFor="sprint-start">Start Date</label>
              <input
                id="sprint-start"
                type="date"
                required
                value={form.startDate}
                onChange={(event) =>
                  setForm({ ...form, startDate: event.target.value })
                }
              />

              <label htmlFor="sprint-end">End Date</label>
              <input
                id="sprint-end"
                type="date"
                required
                min={form.startDate || undefined}
                value={form.endDate}
                onChange={(event) =>
                  setForm({ ...form, endDate: event.target.value })
                }
              />

              <label>Assign Tasks</label>
              <div className="sprint-task-picker">
                {availableTasks.length === 0 && (
                  <p>No tasks available for this project.</p>
                )}

                {availableTasks.map((task) => (
                  <label key={task.id} className="sprint-task-option">
                    <input
                      type="checkbox"
                      checked={form.taskIds.includes(task.id)}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span>{task.title}</span>
                  </label>
                ))}
              </div>

              <div className="project-form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingId ? "Save Changes" : "Create Sprint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}