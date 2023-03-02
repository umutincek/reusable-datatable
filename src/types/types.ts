export interface Column {
  key: string;
  title: string;
  render?: (text: any, row: Record<string, any>) => React.ReactNode;
}

export interface DataTableProps {
  data: any[];
  columns: Column[];
  pageSize?: number;
}

export type SortType = "asc" | "desc";

