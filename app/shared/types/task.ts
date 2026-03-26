import { TaskPriority, TaskStatus } from "./enums";

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** Optional; missing in legacy stored tasks is treated as no labels */
  labels?: string[];
  customFields?: Record<string, string | number | boolean>;
}
