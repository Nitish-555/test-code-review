export interface FilterState {
  searchQuery?: string;
  selectedPriorities?: string[];
  selectedStatuses?: string[];
  selectedLabels?: string[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  currentPage?: number;
  pageSize?: number;
}
