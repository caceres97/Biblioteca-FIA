// Clase Ejemplar  de Ejemplares

import { Transaccion, Libro } from './'

export class Ejemplar{
  id: number;
  codigo: string;
  estado: string;
  transacciones: Transaccion[];
  libro: Libro;
}
