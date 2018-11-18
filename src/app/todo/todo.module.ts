import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { TodoComponent } from './todo.component';
import { TodoService } from './todo.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoListItemComponent } from './todo-list/todo-list-item/todo-list-item.component';
import { TodoDetailsComponent } from './todo-details/todo-details.component';

const routes: Routes = [
    {
        path     : 'all',
        component: TodoComponent,
        resolve  : {
            todo: TodoService
        }
    },
    {
        path     : 'all/:todoId',
        component: TodoComponent,
        resolve  : {
            todo: TodoService
        }
    },
    {
        path     : 'filter/:filterHandle',
        component: TodoComponent,
        resolve  : {
            todo: TodoService
        }
    },
    {
        path     : 'filter/:filterHandle/:todoId',
        component: TodoComponent,
        resolve  : {
            todo: TodoService
        }
    },
    {
        path      : '**',
        redirectTo: 'all'
    }
];

@NgModule({
    declarations: [
        TodoComponent,
        SidebarComponent,
        TodoListComponent,
        TodoListItemComponent,
        TodoDetailsComponent,
    ],
    imports     : [
        SharedModule,

        RouterModule.forChild(routes),
    ],
    providers   : [TodoService]
})
export class TodoModule
{
    constructor(todoService: TodoService)
    {
        todoService.setFakeData();
    }
}
