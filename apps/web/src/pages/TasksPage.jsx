import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  GripVertical,
  ListTodo,
} from "lucide-react";
import "./ProjectsPage.css";

import { useTasks } from "../features/tasks/useTasks";
import { useProjects } from "../features/projects/useProjects";
import "./TasksPage.css";

const statuses = ["To Do", "In Progress", "Done"];

const emptyForm = {
  title: "",
  description: "",
  projectId: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);

      const matchesStatus =
        filter === "All" || task.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, filter]);

  function openCreateForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      projectId: projects[0]?.id ?? "",
    });
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.projectId) return;

    const data = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    };

    if (editingId) {
      updateTask(editingId, data);
    } else {
      addTask(data);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(task) {
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  }

  function handleDragStart(event, taskId) {
    event.dataTransfer.setData("text/plain", taskId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(event, status) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("text/plain");
    if (tasks.some((task) => task.id === taskId)) {
      updateTask(taskId, { status });
    }
  }

  function getProjectName(projectId) {
    return (
      projects.find((project) => project.id === projectId)?.name ??
      "Deleted Project"
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-heading">
        <div>
          <h1>Task Board</h1>
          <p>Manage your work using a Kanban workflow.</p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreateForm}
          disabled={projects.length === 0}
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="tasks-toolbar">
        <div className="tasks-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter tasks by status"
        >
          <option value="All">All Statuses</option>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      {projects.length === 0 && (
        <p className="tasks-notice">
          Create a project first before adding tasks.
        </p>
      )}

      <div className="kanban-board">
        {statuses.map((status) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === status
          );

          return (
            <section
              className="kanban-column"
              key={status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, status)}
            >
              <div className="kanban-column-heading">
                <h2>{status}</h2>
                <span>{columnTasks.length}</span>
              </div>

              <div className="kanban-cards">
                {columnTasks.map((task) => (
                  <article
                    className="kanban-card"
                    key={task.id}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, task.id)
                    }
                  >
                    <div className="kanban-card-top">
                      <GripVertical size={17} />
                      <span
                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <div className="kanban-card-meta">
                      <span>{getProjectName(task.projectId)}</span>
                      <small>{task.dueDate || "No due date"}</small>
                    </div>

                    <div className="kanban-card-actions">
                      <button onClick={() => openEditForm(task)}>
                        <Pencil size={15} /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(task)}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </article>
                ))}

                {columnTasks.length === 0 && (
                  <div className="kanban-empty">
                    <ListTodo size={24} />
                    <p>No tasks</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {showForm && (
        <div className="project-modal-overlay">
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
          >
            <div className="project-modal-heading">
              <h2 id="task-form-title">
                {editingId ? "Edit Task" : "Create Task"}
              </h2>

              <button
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                required
                maxLength={120}
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />

              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />

              <label htmlFor="task-project">Project</label>
              <select
                id="task-project"
                required
                value={form.projectId}
                onChange={(event) =>
                  setForm({ ...form, projectId: event.target.value })
                }
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <label htmlFor="task-due-date">Due Date</label>
              <input
                id="task-due-date"
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm({ ...form, dueDate: event.target.value })
                }
              />

              <div className="project-form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}