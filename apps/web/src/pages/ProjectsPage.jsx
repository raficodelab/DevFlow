import { useMemo, useState } from "react";
import { FolderKanban, Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { useProjects } from "../features/projects/useProjects";
import "./ProjectsPage.css";

const emptyForm = {
  name: "",
  description: "",
  status: "Planning",
  priority: "Medium",
};

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);

      const matchesStatus = filter === "All" || project.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, filter]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) return;

    const projectData = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    };

    if (editingId) {
      updateProject(editingId, projectData);
    } else {
      addProject(projectData);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(project) {
  if (
    window.confirm(
      `Delete "${project.name}"? Its linked tasks will remain until removed separately.`
    )
  ) {
    deleteProject(project.id);
  }
}

  return (
    <div className="projects-page">
      <div className="projects-heading">
        <div>
          <h1>Projects</h1>
          <p>Organize and manage your projects in one place.</p>
        </div>

        <button className="primary-btn" onClick={openCreateForm}>
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter projects by status"
        >
          <option value="All">All Statuses</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card-top">
              <span className="project-icon">
                <FolderKanban size={23} />
              </span>

              <span className="project-status">{project.status}</span>
            </div>

            <h2>{project.name}</h2>
            <p>{project.description || "No description provided."}</p>

            <div className="project-card-meta">
              <span>Priority: {project.priority}</span>
              <span>{project.createdAt}</span>
            </div>

            <div className="project-card-actions">
              <button onClick={() => openEditForm(project)}>
                <Pencil size={16} /> Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(project)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="projects-empty">
          <FolderKanban size={38} />
          <h2>No projects found</h2>
          <p>Try another search or create a new project.</p>
        </div>
      )}

      {showForm && (
        <div className="project-modal-overlay">
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-form-title"
          >
            <div className="project-modal-heading">
              <h2 id="project-form-title">
                {editingId ? "Edit Project" : "Create Project"}
              </h2>

              <button
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="project-name">Project Name</label>
              <input
                id="project-name"
                required
                maxLength={100}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter project name"
              />

              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Project description"
              />

              <label htmlFor="project-status">Status</label>
              <select
                id="project-status"
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>

              <label htmlFor="project-priority">Priority</label>
              <select
                id="project-priority"
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <div className="project-form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingId ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}