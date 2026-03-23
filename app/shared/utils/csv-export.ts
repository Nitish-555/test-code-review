import type { Task } from "../types/task";
import type { CustomField } from "../types/custom-field";
import { getTaskLabels } from "./task-labels";

function neutralizeCsvFormula(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `\t${value}`;
  }
  return value;
}

function escapeCsvCell(value: string): string {
  const safe = neutralizeCsvFormula(value);
  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

function collectCustomFieldNames(
  tasks: Task[],
  customFields: CustomField[]
): string[] {
  const names = new Set<string>();
  for (const f of customFields) {
    names.add(f.name);
  }
  for (const t of tasks) {
    if (t.customFields) {
      Object.keys(t.customFields).forEach((k) => names.add(k));
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

function formatCustomValue(
  task: Task,
  field: CustomField | undefined,
  name: string
): string {
  const raw = task.customFields?.[name];
  if (raw === undefined || raw === null) return "";
  if (field?.type === "checkbox") return raw ? "true" : "false";
  return String(raw);
}

export function tasksToCsv(
  tasks: Task[],
  customFields: CustomField[]
): string {
  const fieldNames = collectCustomFieldNames(tasks, customFields);
  const fieldByName = new Map(customFields.map((f) => [f.name, f]));

  const headers = [
    "id",
    "title",
    "priority",
    "status",
    "labels",
    ...fieldNames,
  ];

  const lines = [headers.map(escapeCsvCell).join(",")];

  for (const task of tasks) {
    const labelsJoined = getTaskLabels(task).join("|");
    const row = [
      String(task.id),
      task.title,
      task.priority,
      task.status,
      labelsJoined,
      ...fieldNames.map((name) => {
        const field = fieldByName.get(name);
        const v = formatCustomValue(task, field, name);
        return v;
      }),
    ];
    lines.push(row.map(escapeCsvCell).join(","));
  }

  return lines.join("\r\n");
}

export function downloadCsvFile(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
