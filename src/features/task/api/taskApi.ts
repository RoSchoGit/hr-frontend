import type { Task } from "../Task";
import { authFetch } from "@/services/authFetch";

const BASE_URL = "http://localhost:8080/tasks";

export async function fetchTasks(): Promise<Task[]> {
  const response = await authFetch(BASE_URL);
  if (!response.ok) throw new Error("Fehler beim Laden der Tasks");
  return response.json();
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const response = await authFetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Fehler beim Erstellen eines Tasks");
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await authFetch(`${BASE_URL}/${id}`,
    {
      method: "DELETE"
    });
  if (!response.ok) throw new Error("Fehler beim Löschen des Tasks");
}

/**
 * Holt alle Tasks für einen Prozess.
 * Backend: GET /tasks/process/{processId}
 */
export async function fetchTasksForProcess(processId: string): Promise<Task[]> {
  const response = await authFetch(`${BASE_URL}/process/${processId}`);
  if (!response.ok) throw new Error("Fehler beim Laden der Tasks für den Prozess");
  return response.json();
}

/**
 * (Optional) Holt explizit Tasks nach IDs.
 * Backend: GET /tasks/tasks?ids=...
 */
export async function fetchTasksByIds(taskIds: string[]): Promise<Task[]> {
  if (!taskIds || taskIds.length === 0) return [];

  const query = taskIds.map((id) => `ids=${id}`).join("&");
  const url = `${BASE_URL}/tasks?${query}`;
  const response = await authFetch(url);
  if (!response.ok) throw new Error("Fehler beim Laden der Tasks nach IDs");
  return response.json();
}
