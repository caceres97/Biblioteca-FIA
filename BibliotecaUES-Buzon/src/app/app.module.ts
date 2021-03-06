/*
*Nombre del módulo: app
*Dirección física: src/app/app.module.ts
*Objetivo: Declaración del módulo principal
**/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterializeModule } from 'angular2-materialize';
import { DataTablesModule } from 'angular-datatables';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SugerenciasModule } from './sugerencias/sugerencias.module';
import { InfoModule } from './info/info.module';
import { LoginModule } from './login/';

@NgModule({
  imports: [
    BrowserModule,
    MaterializeModule,
    DataTablesModule,
    Angular2FontawesomeModule,
    LoginModule,
    SugerenciasModule,
    InfoModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
