import { Injectable, signal } from '@angular/core';

export interface TipoCambio {
  fecha: string;
  monedaBase: string;
  monedaReferencia: string;
  compra: number;
  venta: number;
}

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  private historial = signal<TipoCambio[]>(this.buildMock());

  private buildMock(): TipoCambio[] {
    const today = new Date();
    const baseCompra = 530.25;
    const baseVenta = 545.75;
    const data: TipoCambio[] = [];

    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const variation = (Math.sin(i) * 0.8) + (Math.cos(i / 2) * 0.5);
      const compra = +(baseCompra + variation - i * 0.1).toFixed(2);
      const venta = +(baseVenta + variation - i * 0.1).toFixed(2);

      data.push({
        fecha: date.toISOString().split('T')[0],
        monedaBase: 'CRC',
        monedaReferencia: 'USD',
        compra,
        venta
      });
    }

    return data.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  getActual() {
    return this.historial()[0];
  }

  getHistorial() {
    return this.historial();
  }

  getByRangoFechas(desde?: string, hasta?: string) {
    if (!desde && !hasta) {
      return this.getHistorial();
    }

    const desdeDate = desde ? new Date(desde) : null;
    const hastaDate = hasta ? new Date(hasta) : null;

    return this.historial().filter(item => {
      const current = new Date(item.fecha);
      const afterDesde = !desdeDate || current >= desdeDate;
      const beforeHasta = !hastaDate || current <= hastaDate;
      return afterDesde && beforeHasta;
    }).sort((a, b) => b.fecha.localeCompare(a.fecha));
  }
}
