import { useStoredCollection } from "../../lib/useStoredCollection";

const initialSprints = [];

export function useSprints() {
  const [sprints, setSprints] = useStoredCollection(
    "devflow_sprints",
    initialSprints
  );

  function addSprint(data) {
    setSprints((prev) => [
      {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function updateSprint(id, data) {
    setSprints((prev) =>
      prev.map((sprint) =>
        sprint.id === id ? { ...sprint, ...data } : sprint
      )
    );
  }

  function deleteSprint(id) {
    setSprints((prev) =>
      prev.filter((sprint) => sprint.id !== id)
    );
  }

  return { sprints, addSprint, updateSprint, deleteSprint };
}