import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgGunModule, AgGunOptions } from 'ag-gun';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const agGunOptions: AgGunOptions = {
    // peers: ['http://localhost:8080/gun']
};

const appRoutes: Routes = [
    {
        path        : 'todo',
        loadChildren: './todo/todo.module#TodoModule'
    },
    {
        path      : '**',
        redirectTo: 'todo'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),

        SharedModule,

        AgGunModule.forRoot(agGunOptions)
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule
{
}
