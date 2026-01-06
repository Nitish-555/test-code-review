import { TaskStatus } from "../types/task";
import { 
  getOverdueTasks, 
  getHighPriorityTasks, 
  getTaskCompletionRate,
  getTaskSummary,
  getTasksNeedingAttention
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
  // Logic issue: Using overdue.length instead of overdue count
  // Also potential null/undefined issue if overdue is null
  return completionRate > 0.5 && overdue.length < total * 0.2;
}

/**
 * Get task statistics with potential memory leak
 */
export function getTaskStatistics(): {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
} {
  const tasks = tasksStorage.getTasks();
  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  
  // Potential issue: No null checks, could crash on undefined task properties
  tasks.forEach((task) => {
    byStatus[task.status] = (byStatus[task.status] || 0) + 1;
    byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
  });
  
  return { byStatus, byPriority };
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

