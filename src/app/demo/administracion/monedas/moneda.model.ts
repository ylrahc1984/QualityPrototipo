export interface Moneda {
  id: string;
  code: string; // USD, EUR, DOP, etc.
  name: string; // Dólar Estadounidense, Euro, Peso Dominicano, etc.
  symbol: string; // $, €, RD$, etc.
  decimalPlaces: number; // Número de decimales (2 para USD, 0 para JPY, etc.)
  isActive: boolean;
  isBaseCurrency: boolean; // Si es la moneda base del sistema
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrencyFormat {
  value: string;
  label: string;
  example: string;
}