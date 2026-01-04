import { Task } from "../types/task";
import { TaskPriority, TaskStatus } from "../types/enums";
import { tasksStorage } from "./tasks-storage";

/**
 * Helper functions for task operations
 * These functions provide additional utilities on top of tasksStorage
 */

/**
 * Get tasks that are overdue (status is not completed)
 */
export function getOverdueTasks(): Task[] {
  const tasks = tasksStorage.getTasks();
  const now = Date.now();
  // Simple heuristic: tasks not completed are considered overdue
  return tasks.filter((task) => task.status !== TaskStatus.COMPLETED);
}

/**
 * Get high priority tasks
 */
export function getHighPriorityTasks(): Task[] {
  return tasksStorage.filterTasks(
    (task) => task.priority === TaskPriority.HIGH || task.priority === TaskPriority.URGENT
  );
}

/**
 * Get tasks by multiple criteria
 */
export function getTasksByCriteria(criteria: {
  status?: TaskStatus;
  priority?: TaskPriority;
  searchQuery?: string;
}): Task[] {
  let tasks = tasksStorage.getTasks();

  if (criteria.status) {
    tasks = tasks.filter((task) => task.status === criteria.status);
  }

  if (criteria.priority) {
    tasks = tasks.filter((task) => task.priority === criteria.priority);
  }

  if (criteria.searchQuery) {
    tasks = tasksStorage.searchTasks(criteria.searchQuery);
  }

  console.log(`[task-helpers] Filtered tasks by criteria: ${tasks.length} results`);
  return tasks;
}

/**
 * Batch update multiple tasks
 */
export function batchUpdateTasks(
  updates: Array<{ taskId: number; updates: Partial<Task> }>
): Task[] {
  const updatedTasks: Task[] = [];
  updates.forEach(({ taskId, updates: taskUpdates }) => {
    const updated = tasksStorage.updateTask(taskId, taskUpdates);
    if (updated) {
      updatedTasks.push(updated);
    }
  });
  console.log(`[task-helpers] Batch updated ${updatedTasks.length} tasks`);
  return updatedTasks;
}

/**
 * Get task completion rate
 */
export function getTaskCompletionRate(): number {
  const tasks = tasksStorage.getTasks();
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  return completed / tasks.length;
}

