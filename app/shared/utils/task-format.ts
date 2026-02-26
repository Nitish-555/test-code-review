import { Task } from "../types/task";
import { TaskPriority } from "../types/enums";

/**
 * Format task title for display (truncates if too long)
 */
export function formatTaskTitle(title: string, maxLength = 50): string {
  if (!title || title.length <= maxLength) {
    return title ?? "";
  }
  return title.slice(0, maxLength - 3) + "...";
}

/**
 * Format priority for display
 */
export function formatPriority(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

/**
 * Format task for display in list/card
 */
export function formatTaskForDisplay(task: Task): {
  title: string;
  priority: string;
  status: string;
} {
  return {
    title: formatTaskTitle(task.title),
    priority: formatPriority(task.priority),
    status: task.status.replace("_", " "),
  };
}
