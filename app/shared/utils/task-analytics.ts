import {
  getOverdueTasks,
  getTaskCompletionRate,
  getTaskSummary,
  getTasksNeedingAttention,
} from "./task-helpers";
import { tasksStorage } from "./tasks-storage";

/**
 * Get comprehensive task analytics
 */
export function getTaskAnalytics(): {
  total: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
  needsAttention: number;
} {
  const summary = getTaskSummary();
  const needsAttention = getTasksNeedingAttention();
  
  return {
    total: summary.total,
    overdue: summary.overdue,
    highPriority: summary.highPriority,
    completionRate: summary.completionRate,
    needsAttention: needsAttention.length,
  };
}

/**
 * Check if task system is healthy
 */
export function isTaskSystemHealthy(): boolean {
  const completionRate = getTaskCompletionRate();
  const overdue = getOverdueTasks();
  const total = tasksStorage.getTasks().length;
  
  if (total === 0) {
    return true;
  }
  return completionRate > 0.5 && overdue.length < total * 0.2;
}

/**
 * Get dashboard data with analytics and health status
 */
export function getTaskDashboardData(): {
  analytics: ReturnType<typeof getTaskAnalytics>;
  health: boolean;
} {
  const analytics = getTaskAnalytics();
  const health = isTaskSystemHealthy();
  
  return { analytics, health };
}

