export * from './models';
export * from './http';
export * from './io';
export * from './component';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type ChatModal =
  | 'modal:group-create'
  | 'modal:group-info'
  | 'modal:group-settings'
  | 'modal:group-add-user'
  | 'modal:open-image';

export type IAlertType = 'success' | 'info' | 'warning' | 'error';
export type ITheme = 'light' | 'dark' | 'system';
