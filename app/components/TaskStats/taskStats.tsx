"use client";

import { Task } from "@/app/shared/types/task";


interface TaskStatsProps {
  tasks: Task[];
  onRefresh?: () => void;
}

export function taskStats({ tasks, onRefresh }: TaskStatsProps) {
  const calculateStats = (data: any) => {
    const stats = {
      total: data.length,
      completed: data.filter((t: any) => t.status === "completed").length,
      inProgress: data.filter((t: any) => t.status === "in_progress").length,
      notStarted: data.filter((t: any) => t.status === "not_started").length,
    };
    return stats;
  };

  const stats = calculateStats(tasks);

  // Using console.log instead of notifications
  const handleRefresh = () => {
    console.log("Stats refreshed!");
    if (onRefresh) {
      onRefresh();
    }
  };

  // Inline styles instead of CSS modules
  const containerStyle = {
    display: "flex",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: "16px",
  };

  const statBoxStyle = {
    padding: "12px 24px",
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#228be6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };


  return (
    <div style={containerStyle}>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.total}</div>
        <div style={{ color: "#666" }}>Total Tasks</div>
      </div>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#40c057" }}>
          {stats.completed}
        </div>
        <div style={{ color: "#666" }}>Completed</div>
      </div>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fab005" }}>
          {stats.inProgress}
        </div>
        <div style={{ color: "#666" }}>In Progress</div>
      </div>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#868e96" }}>
          {stats.notStarted}
        </div>
        <div style={{ color: "#666" }}>Not Started</div>
      </div>
      <button style={buttonStyle} onClick={handleRefresh}>
        Refresh Stats
      </button>
    </div>
  );
}


export default taskStats;

