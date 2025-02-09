export interface TableHeader {
  key: string;
  label: string;
  headerCss?: string;
  bodyCss?: string;
}

export interface TableMeta {
  page: number;
  perPage: number;
}