import { getOverdueTasks, getTasksNeedingAttention, getTaskHealthMetrics } from "./task-helpers";
import { getTaskAnalytics, isTaskSystemHealthy } from "./task-analytics";

/**
 * Get notification data (calls 2 functions from analytics, 1 from helpers)
 */
export function getTaskNotifications(): {
  overdueCount: number;
  needsAttentionCount: number;
  healthStatus: string;
} {
  const analytics = getTaskAnalytics();
  const needsAttention = getTasksNeedingAttention();
  const health = isTaskSystemHealthy();
  
  return {
    overdueCount: analytics.overdue,
    needsAttentionCount: needsAttention.length,
    healthStatus: health ? 'healthy' : 'needs-attention',
  };
}

/**
 * Should send alert? (calls 3 functions)
 */
export function shouldSendTaskAlert(): boolean {
  const health = isTaskSystemHealthy();
  const needsAttention = getTasksNeedingAttention();
  const healthMetrics = getTaskHealthMetrics();
  
  return !health || needsAttention.length > 10 || healthMetrics.completionRate < 0.3;
}

/**
 * Get alert message (calls 2 functions)
 */
export function getTaskAlertMessage(): string | null {
  const notifications = getTaskNotifications();
  const shouldAlert = shouldSendTaskAlert();
  
  if (!shouldAlert) {
    return null;
  }
  
  if (notifications.overdueCount > 0) {
    return `You have ${notifications.overdueCount} overdue tasks`;
  }
  
  if (notifications.needsAttentionCount > 10) {
    return `You have ${notifications.needsAttentionCount} tasks needing attention`;
  }
  
  return 'Task system needs attention';
}

