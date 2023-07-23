export * from './models';
export * from './http';
export * from './io';
export * from './i18n';
export * from './injected';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];


export interface Pagination {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}

export interface PaginationRequest<T = any> {
  limit: number;
  page: number;
  filter: T;
  sort: string;
  descending: boolean;
}

export type ChatModal =
  | 'modal:group-create'
  | 'modal:group-info'
  | 'modal:group-settings'
  | 'modal:group-add-user'
  | 'modal:open-image';

export type IAlertType = 'success' | 'info' | 'warning' | 'error';
export type ITheme = 'light' | 'dark' | 'system';
