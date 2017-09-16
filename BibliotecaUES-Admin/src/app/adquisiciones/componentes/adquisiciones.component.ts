/*
*Nombre del módulo: Gestión de adquisiciones
*Dirección física: src\app\adquisiciones\componentes\adquisiciones.component.ts
*Objetivo: Mostrar una tabla con las diferentes adquisiciones
**/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Rx';

import { AdquisicionesService, Adquisicion } from './../servicios';

@Component({
  templateUrl: './adquisiciones.component.html'
})

export class AdquisicionesComponent implements OnInit {
  adquisiciones: Adquisicion[];
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private adquisicionesService: AdquisicionesService, private router: Router) {
    // Opciones de datatable
    this.dtOptions = {
      pageLength: 10,
      pagingType: 'simple_numbers',
      lengthMenu: [10,15,20],
      order: [[2, "desc"], [0, "asc"]]
    };
  }

  ngOnInit(): void {
    // Llama al servicio
    this.adquisicionesService.obtenerTodos().subscribe(
      adquisiciones => {
        // Asigna las adquisiciones y refresca la tabla
        this.adquisiciones = adquisiciones;
        this.dtTrigger.next();
      }
    );
  }

  // Rediriga a la vista de nueva adquisición
  linkAdquisicion(adquisicion: Adquisicion){
    this.router.navigate(["/adquisiciones/"+adquisicion.id])
  }
}
