/*
*Nombre del módulo: libros-routing
*Dirección física: src/app/libros/libros-routing.module.ts
*Objetivo: Definir las rutas del módulo libros
**/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibrosRootComponent, LibroComponent, LibrosComponent } from './componentes';

const routes: Routes = [
  {
    path: 'libros',
    component: LibrosRootComponent,
    children: [
      {
        path: '',
        component: LibrosComponent
      },
      {
        path: ':id',
        component: LibroComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LibrosRoutingModule { }
