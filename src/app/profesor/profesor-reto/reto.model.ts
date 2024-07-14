export interface Reto {
  id?: string;
  puntos: number;
  cronometro: number;
  nombreReto: string;
  descripcion?: string;
  timestamp: number;
  tiempoRestante?: number;
}
