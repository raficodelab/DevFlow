import { useStoredCollection } from "../../lib/useStoredCollection";

const initialTasks = [
  {
    id: "task-1",
    title: "Design dashboard UI",
    description: "Create responsive dashboard components.",
    projectId: "project-1",
    status: "Done",
    priority: "High",
    dueDate: "2026-11-20",
  },
  {
    id: "task-2",
    title: "Implement authentication",
    description: "Build login and signup interface.",
    projectId: "project-1",
    status: "In Progress",
    priority: "High",
    dueDate: "2026-11-25",
  },
  {
    id: "task-3",
    title: "Create project documentation",
    description: "Write project requirements.",
    projectId: "project-1",
    status: "To Do",
    priority: "Medium",
    dueDate: "2026-11-30",
  },
];

export function useTasks() {
  const [tasks, setTasks] = useStoredCollection(
    "devflow_tasks",
    initialTasks
  );

  function addTask(data) {
    setTasks((prev) => [
      { ...data, id: crypto.randomUUID() },
      ...prev,
    ]);
  }

  function updateTask(id, data) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...data } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return { tasks, addTask, updateTask, deleteTask };
}