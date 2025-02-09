export interface TableHeader {
  key: string;        // Column identifier
  label: string;      // Display name for the column
  headerCss?: string;
  bodyCss?: string;
}

export interface TableMeta {
  page: number;
  perPage: number;
}