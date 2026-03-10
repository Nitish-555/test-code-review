import { TaskPriority, TaskStatus } from "./enums";

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** Optional due date in ISO format (YYYY-MM-DD). */
  dueDate?: string;
  customFields?: Record<string, string | number | boolean>;
}
