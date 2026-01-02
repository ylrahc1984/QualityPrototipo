export interface Correlativo {
  id: string;
  name: string;
  description: string;
  prefix: string;
  currentNumber: number;
  digits: number;
  separator: string;
  module: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CorrelativoModule {
  value: string;
  label: string;
  description: string;
}