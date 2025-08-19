// src/api/taskApi.ts

import type { Process } from "@/process/Process";

const BASE_URL = "http://localhost:8080/processes";

export async function fetchProcesses(): Promise<Process[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Fehler beim Laden der Processes");

  const data = await response.json();
  console.log("Gekommene Daten:", data);

  return data;
}

export async function createProcess(task: Partial<Process>): Promise<Process> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Fehler beim Erstellen eines Processes");
  return response.json();
}

export async function deleteProcess(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Fehler beim Löschen des Processes");
}

