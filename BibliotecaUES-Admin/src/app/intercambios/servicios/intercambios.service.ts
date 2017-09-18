// Servicios de intercambios

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { CookieService } from 'ngx-cookie';
import { Intercambio, Ejemplar, Libro, NuevaEntrada } from './';

@Injectable()
export class IntercambiosService {
  baseUrl: string;
  headers: Headers;

  constructor(private http: Http, private cookieService: CookieService) {
    this.baseUrl = "https://bibliotecafiaues.herokuapp.com";
    this.headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.cookieService.get('token') });
  }

  // Método: crear
  // Objetivo: crear un nuevo intercambio
  crear(intercambio: Intercambio): Observable<string> {
    let url = this.baseUrl + "/transactions/tradeout";

    // Haciendo un arreglo de ids de ejemplares de salida
    let ejemplares = [];
    intercambio.ejemplares.forEach((ejemplar)=>{
      ejemplares.push(ejemplar.id);
    });

    // Agregando titulo al intercambio
    let titulo = "Intercambio con " + intercambio.facultad;

    // Mapeando la entrada
    let q = JSON.stringify({notes: titulo, copies: ejemplares});

    // Realizando POST
    return this.http.post(url, q, { headers: this.headers }).map(
      // Mapeando salida
      (response: Response) => {
        let r = response.json();
        return r['message'];
      }
    );
  }

  // Método: crearEntrada
  // Objetivo: crear la entrada de un intercambio
  crearEntrada(entrada: NuevaEntrada): Observable<string> {
    let url = this.baseUrl + '/transactions/tradein';

    // Haciendo un arreglo de ids de ejemplares de salida
    let ejemplares = [];
    entrada.ejemplares.forEach((ejemplar)=>{
      ejemplares.push({bookId: ejemplar.libro.id, quantity: ejemplar.cantidad});
    });

    // Mapeando la entrada
    let q = JSON.stringify({transactionId: entrada.id, notes: entrada.facultad, copies: ejemplares});

    // Realizando POST
    return this.http.post(url, q, { headers: this.headers }).map(
      // Mapeando salida
      (response: Response) => {
        let r = response.json();
        return r['message'];
      }
    );
  }

  // Método: catalogar
  // Objetivo: asignar códigos de barra a los ejemplares de un intercambio
  catalogar(ejemplares: Ejemplar[]): Observable<string>{
    let url = this.baseUrl + '/copies/massCataloging';

    // Mapeando la entrada.
    let copies = [];
    ejemplares.forEach(function(ejemplar){
      if(!ejemplar.ingresado && ejemplar.codigo) copies.push({id: ejemplar.id, barcode: ejemplar.codigo});
    });

    let q = JSON.stringify({copies: copies});

    // Realizando POST
    return this.http.post(url, q, { headers: this.headers }).map(
      // Mapeando salida
      (response: Response) => {
        return "guardados";
      }
    );
  }

  // Método: obtenerTodos
  // Objetivo: obtener todos los intercambios realizados
  obtenerTodos(): Observable<any> {
    let url = this.baseUrl + '/copies/lots?type=2';

    // Realizando GET
    return this.http.get(url, { headers: this.headers }).map(
      // Mapeando la salida
      (response: Response) => {
        let a = response.json();
        let r = a[0];
        let intercambios = new Array<Intercambio>();

        r.forEach(function(item) {
          let intercambio = new Intercambio;
          intercambio.id = item['id'];
          intercambio.facultad = item['notes'];
          intercambio.fecha = item['createdAt'];
          intercambio.usuario = item['fullname'];
          intercambios.push(intercambio);
        });

        return intercambios;
      }
    );
  }

  // Método: obtener
  // Objetivo: obtener un intercambio (de entrada o salida)
  obtener(id: number): Observable<Intercambio> {
    let url = this.baseUrl + '/transactions/' + id;

    // Realizando GET
    return this.http.get(url, { headers: this.headers }).map(
      // Mapeando la salida
      (response: Response) => {
        let r = response.json();
        let intercambio = new Intercambio;
        let rd = r['details'];
        let rc = r['copies'];
        let rr = r["Related"];

        // Mapear el objeto de intercambio
        intercambio.id = r['id'];
        intercambio.facultad = r['notes'];
        intercambio.usuario = r['userName'];
        intercambio.fecha = r['createdAt'];
        intercambio.relacionado = rr? rr['id'] || null : null;

        // Mapear las ejemplares.
        let ejemplares = new Array<Ejemplar>();
        rc.forEach(function(item){
          let ejemplar = new Ejemplar;
          ejemplar.id = item['id'];
          ejemplar.codigo = item['barcode'];
          ejemplar.estado = item['state'];
          ejemplar.ingresado = ejemplar.codigo? true: false;

          // Mapear el libro
          let rb = item['book'];
          let libro = new Libro;
          libro.id = rb['id'];
          libro.titulo = rb['title'];
          libro.edicion = rb['edition'];
          ejemplar.libro = libro;

          ejemplares.push(ejemplar);
        });
        intercambio.ejemplares = ejemplares;

        return intercambio;
      }
    );
  }

  // Método: obtenerEjemplares
  // Objetivo: obtener todos los ejemplares existentes.
  obtenerEjemplares(): Observable<Ejemplar[]> {
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

  // Método: obtenerPorCodigo
  // Objetivo: obtener un ejemplar por su código de barra, solo si está inactivo
  obtenerPorCodigo(codigo: string): Observable<Ejemplar>{
    let url = this.baseUrl + '/copies/barcode/' + codigo + "?inactive=1";

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
