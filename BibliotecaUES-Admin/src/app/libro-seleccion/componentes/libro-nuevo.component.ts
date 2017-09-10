/*
*Nombre del módulo: Gestión de libros
*Dirección física: src\app\libro-seleccion\componentes\libro-nuevo.component.ts
*Objetivo: Crear un nuevo libro
**/

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'libro-nuevo',
  templateUrl: './libro-nuevo.component.html'
})

export class LibroNuevoComponent implements OnInit {
  datos : any;
  chipsAutocomplete : any;

  ngOnInit() {
    this.datos = {};
    this.datos['Apple'] = null;
    this.datos['Google'] = null;

    this.chipsAutocomplete = {
      autocompleteOptions: {
        data: this.datos,
        limit: Infinity,
        minLength: 1
      }
    };
  }
}
