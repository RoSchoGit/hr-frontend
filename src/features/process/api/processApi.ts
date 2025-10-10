// src/api/taskApi.ts

import type { Process } from "@/features/process/Process";
import { authFetch } from "@/services/authFetch";

const BASE_URL = "http://localhost:8080/processes";

export async function fetchProcesses(): Promise<Process[]> {
  const response = await authFetch(BASE_URL);
  if (!response.ok) throw new Error("Fehler beim Laden der Processes");

  const data = await response.json();
  console.log("Gekommene Daten:", data);

  return data;
}

export async function createProcess(process: Partial<Process>): Promise<Process> {
  const response = await authFetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(process),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error("Backend-Fehler:", text);
    throw new Error("Fehler beim Erstellen eines Processes");
  }
  return response.json();
}

export async function deleteProcess(id: string): Promise<void> {
  const response = await authFetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Fehler beim Löschen des Processes");
}


