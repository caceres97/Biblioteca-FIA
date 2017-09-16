// Servicios de ejemplares

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { CookieService } from 'ngx-cookie';
import { Ejemplar, Transaccion, Libro } from './';

@Injectable()
export class EjemplaresService {
  baseUrl: string;
  headers: Headers;

  constructor(private http: Http, private cookieService: CookieService) {
    this.baseUrl = "https://bibliotecafiaues.herokuapp.com";
    this.headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.cookieService.get('token') });
  }

  // Método: obtenerTodos
  // Objetivo: obtener todos los ejemplares existentes.
  obtenerTodos(): Observable<Ejemplar[]> {
    let url = this.baseUrl + '/copies';

    // Realizando GET
    return this.http.get(url, { headers: this.headers }).map(
      // Mapeando la salida
      (response: Response) => {
        let r = response.json();
        let ejemplares = new Array<Ejemplar>();

        r.forEach(function(item) {
          let ejemplar = new Ejemplar;
          ejemplar.id = item['id'];
          ejemplar.codigo = item['barcode'];
          ejemplar.estado = item['state'];
          ejemplares.push(ejemplar);
        });
        return ejemplares;
      }
    );
  }

  // Método: obtener
  // Objetivo: obtener un ejemplar
  obtener(id: number): Observable<Ejemplar> {
    let url = this.baseUrl + '/copies/' + id;

    // Realizando GET
    return this.http.get(url, { headers: this.headers }).map(
      // Mapeando la salida
      (response: Response) => {
        let r = response.json();
        let ejemplar = new Ejemplar;
        let rc = r['copy'];
        let rt = rc['transactions'];
        let rb = r['book'];

        // Mapear el objeto de ejemplar
        ejemplar.id = rc['id'];
        ejemplar.codigo = rc['barcode'];
        ejemplar.estado = rc['state'];

        // Mapear las transacciones.
        let transacciones = new Array<Transaccion>();
        rt.forEach(function(item){
          let transaccion = new Transaccion;
          transaccion.id = item['id'];
          transaccion.nombre = item['notes'];
          transaccion.fecha = item['createdAt'];
          transaccion.usuario = item['userName'];
          transaccion.tipo = item['type'];
          transaccion.individual = item['single'];
          transacciones.push(transaccion);
        });

        ejemplar.transacciones = transacciones;

        console.log(r)
        // Mapear el libros
        let libro = new Libro;
        libro.id = rb['id'];
        libro.titulo = rb['title'];
        libro.edicion = rb['edition'];
        ejemplar.libro = libro;

        return ejemplar;
      }
    );
  }

  // Método: obtenerPorCodigo
  // Objetivo: obtener un ejemplar por su código de barra.
  obtenerPorCodigo(codigo: string): Observable<Ejemplar>{
    let url = this.baseUrl + '/copies/barcode/' + codigo;

    // Realizando GET
    return this.http.get(url, { headers: this.headers }).map(
      // Mapeando la salida
      (response: Response) => {
        let r = response.json();
        let ejemplar = new Ejemplar;
        let rc = r['copy'];
        let rb = r['book'];

        // Mapear el objeto de ejemplar
        ejemplar.id = rc['id'];
        ejemplar.codigo = rc['barcode'];
        ejemplar.estado = rc['state'];

        // Mapear el libros
        let libro = new Libro;
        libro.id = rb['id'];
        libro.titulo = rb['title'];
        libro.edicion = rb['edition'];
        ejemplar.libro = libro;

        return ejemplar;
      }
    );
  }
}