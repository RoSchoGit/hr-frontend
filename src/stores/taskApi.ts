// src/api/taskApi.ts

import type { Task } from "@/models/Task";

const BASE_URL = "http://localhost:8080/tasks";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Fehler beim Laden der Tasks");
  return response.json();
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Fehler beim Erstellen eines Tasks");
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Fehler beim Löschen des Tasks");
}
