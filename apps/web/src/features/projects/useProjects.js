import { useStoredCollection } from "../../lib/useStoredCollection";

const initialProjects = [
  {
    id: "project-1",
    name: "DevFlow Platform",
    description: "Smart project and team management application.",
    status: "In Progress",
    priority: "High",
    createdAt: "2026-11-01",
  },
  {
    id: "project-2",
    name: "Portfolio Website",
    description: "Personal developer portfolio.",
    status: "Completed",
    priority: "Medium",
    createdAt: "2026-11-05",
  },
];

export function useProjects() {
  const [projects, setProjects] = useStoredCollection(
    "devflow_projects",
    initialProjects
  );

  function addProject(project) {
    setProjects((prev) => [
      {
        ...project,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  }

  function updateProject(id, data) {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...data } : project
      )
    );
  }

  function deleteProject(id) {
    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  }

  return { projects, addProject, updateProject, deleteProject };
}