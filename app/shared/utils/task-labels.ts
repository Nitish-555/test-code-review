import type { Task } from "../types/task";

export const MAX_LABELS_PER_TASK = 8;
export const MAX_LABEL_LENGTH = 40;

export function normalizeLabels(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    const s = String(raw).trim();
    if (s.length === 0) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s.slice(0, MAX_LABEL_LENGTH));
    if (out.length >= MAX_LABELS_PER_TASK) break;
  }
  return out;
}

export function normalizeTask(task: Task): Task {
  return {
    ...task,
    labels: normalizeLabels(task.labels),
  };
}

export function getTaskLabels(task: Task): string[] {
  return normalizeLabels(task.labels);
}

export function collectDistinctLabels(tasks: Task[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const task of tasks) {
    for (const label of getTaskLabels(task)) {
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      ordered.push(label);
    }
  }
  return ordered.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export function taskMatchesLabelFilter(
  task: Task,
  selectedLabels: string[]
): boolean {
  if (selectedLabels.length === 0) return true;
  const taskLabels = getTaskLabels(task).map((l) => l.toLowerCase());
  return selectedLabels.some((sel) =>
    taskLabels.includes(sel.toLowerCase())
  );
}

export function labelsSortKey(task: Task): string {
  return [...getTaskLabels(task)].sort((a, b) => a.localeCompare(b)).join("|");
}
